import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer

AUTH_SERVICE_URL = 'http://auth-service:8001'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        comment = serializer.save(
            author_id=request.user.id,
            author_username=request.user.username
        )
        # Notify post author via auth-service
        try:
            requests.post(
                f'{AUTH_SERVICE_URL}/api/auth/notifications/internal/',
                json={
                    'recipient_id': request.data.get('post_author_id'),
                    'actor_id': request.user.id,
                    'actor_username': request.user.username,
                    'notification_type': 'comment',
                    'message': f'@{request.user.username} commented on your post',
                },
                timeout=2
            )
        except Exception:
            pass  # notification failure should never break commenting
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
def internal_create_notification(request):
    recipient_id = request.data.get('recipient_id')
    if not recipient_id:
        return Response({'error': 'recipient_id required'}, status=status.HTTP_400_BAD_REQUEST)
    # Don't notify yourself
    if str(recipient_id) == str(request.data.get('actor_id')):
        return Response({'status': 'skipped'})
    Notification.objects.create(
        recipient_id=recipient_id,
        actor_id=request.data.get('actor_id'),
        actor_username=request.data.get('actor_username'),
        notification_type=request.data.get('notification_type'),
        message=request.data.get('message'),
    )
    return Response({'status': 'ok'})