from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post, Like
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
            author_id=request.user.id,
            author_username=request.user.username
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
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
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication credentials were not provided.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if post.author_id != request.user.id:
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
        user_id=request.user.id
    )

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    return Response(
        {
            'liked': liked,
            'likes_count': post.likes.count()
        },
        status=status.HTTP_200_OK
    )
