from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from .models import User, Follow, Notification, EmailOTP
from .utils import generate_otp, send_otp_email


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get('email', '').lower().strip()
    username = request.data.get('username', '').strip()

    if not email:
        return Response({'error': 'Email address is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_email(email)
    except ValidationError:
        return Response({'error': 'Please provide a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if username and User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    # Rate limiting / cooldown: 30s between OTP requests for the same email
    existing_otp = EmailOTP.objects.filter(email=email).order_by('-created_at').first()
    if existing_otp and (timezone.now() - existing_otp.created_at).total_seconds() < 30:
        remaining = int(30 - (timezone.now() - existing_otp.created_at).total_seconds())
        return Response(
            {'error': f'Please wait {remaining} seconds before requesting a new code.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    otp = generate_otp()
    EmailOTP.objects.update_or_create(
        email=email,
        defaults={'otp': otp, 'created_at': timezone.now(), 'is_verified': False}
    )

    send_otp_email(email, otp, async_send=True)

    from django.conf import settings
    response_data = {
        'message': f'Verification code sent to {email}.',
    }
    if settings.DEBUG:
        response_data['debug_otp'] = otp

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get('email', '').lower().strip()
    otp = request.data.get('otp', '').strip()

    if not email or not otp:
        return Response({'error': 'Email and verification code are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        otp_record = EmailOTP.objects.filter(email=email).latest('created_at')
    except EmailOTP.DoesNotExist:
        return Response({'error': 'No verification code found for this email.'}, status=status.HTTP_400_BAD_REQUEST)

    if not otp_record.is_valid():
        return Response({'error': 'Verification code has expired. Please request a new code.'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_record.otp != otp:
        return Response({'error': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)

    otp_record.is_verified = True
    otp_record.save()

    return Response({'message': 'Email verified successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        return Response(
            {
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        return Response(
            {
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            },
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(
        {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'bio': user.bio,
            'created_at': user.created_at,
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.user.id == target_user.id:
        return Response(
            {'error': 'You cannot follow yourself'},
            status=status.HTTP_400_BAD_REQUEST
        )

    follow, created = Follow.objects.get_or_create(
        follower_id=request.user.id,
        following_id=target_user.id,
        defaults={
            'follower_username': request.user.username,
            'following_username': target_user.username,
        }
    )

    if not created:
        follow.delete()
        following = False
    else:
        following = True
        Notification.objects.create(
            recipient_id=target_user.id,
            actor_id=request.user.id,
            actor_username=request.user.username,
            notification_type='follow',
            message=f'@{request.user.username} followed you',
        )

    return Response(
        {
            'following': following,
            'followers_count': Follow.objects.filter(following_id=target_user.id).count(),
        },
        status=status.HTTP_200_OK
    )
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    Notification.objects.filter(
        recipient_id=request.user.id,
        is_read=False
    ).update(is_read=True)
    return Response({'status': 'ok'})


@api_view(['GET'])
@permission_classes([AllowAny])
def follow_status(request, username):
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    followers_count = Follow.objects.filter(following_id=target_user.id).count()
    following_count = Follow.objects.filter(follower_id=target_user.id).count()

    is_following = False
    if hasattr(request.user, 'id'):
        is_following = Follow.objects.filter(
            follower_id=request.user.id,
            following_id=target_user.id
        ).exists()

    return Response(
        {
            'followers_count': followers_count,
            'following_count': following_count,
            'is_following': is_following,
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    items = Notification.objects.filter(recipient_id=request.user.id)[:20]
    unread_count = Notification.objects.filter(
        recipient_id=request.user.id,
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
                    'is_read': item.is_read,
                    'created_at': item.created_at,
                    'source': 'auth',
                }
                for item in items
            ]
        },
        status=status.HTTP_200_OK
    )
