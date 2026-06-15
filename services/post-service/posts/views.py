import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post, Like, Notification
from .serializers import PostSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_posts(request):
    author_username = request.query_params.get('author', None)
    if author_username:
        posts = Post.objects.filter(author_username=author_username)
    else:
        posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(
            author_id=int(request.user.id),
            author_username=request.user.username
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(
            {'error': 'Post not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        if post.author_id != int(request.user.id):
            return Response(
                {'error': 'You can only delete your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        post.delete()
        return Response(
            {'message': 'Post deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(
            {'error': 'Post not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    like, created = Like.objects.get_or_create(
        post=post,
        user_id=int(request.user.id)
    )

    if not created:
        like.delete()
        liked = False
    else:
        liked = True
        if post.author_id != int(request.user.id):
            Notification.objects.create(
                recipient_id=post.author_id,
                actor_id=int(request.user.id),
                actor_username=request.user.username,
                post=post,
                notification_type='like',
                message=f'@{request.user.username} liked your post "{post.title}"',
            )

    return Response(
        {
            'liked': liked,
            'likes_count': post.likes.count()
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    items = Notification.objects.filter(recipient_id=int(request.user.id))[:20]
    unread_count = Notification.objects.filter(
        recipient_id=int(request.user.id),
        is_read=False
    ).count()
    return Response(
        {
            'unread_count': unread_count,
            'notifications': [
                {
                    'id': item.id,
                    'type': item.notification_type,
                    'message': item.message,
                    'actor_username': item.actor_username,
                    'post_id': item.post_id,
                    'is_read': item.is_read,
                    'created_at': item.created_at,
                    'source': 'post',
                }
                for item in items
            ]
        },
        status=status.HTTP_200_OK
    )
