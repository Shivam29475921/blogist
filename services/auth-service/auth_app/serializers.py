from rest_framework import serializers
from .models import User, EmailOTP
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    otp = serializers.CharField(write_only=True, min_length=6, max_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'otp']

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return email

    def validate_username(self, value):
        username = value.strip()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError('Username is already taken.')
        return username

    def validate(self, data):
        email = data.get('email', '').lower().strip()
        otp = data.get('otp', '').strip()

        try:
            otp_record = EmailOTP.objects.filter(email=email).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({'otp': 'No verification code found for this email. Please request a new code.'})

        if not otp_record.is_valid():
            raise serializers.ValidationError({'otp': 'Verification code has expired. Please request a new code.'})

        if otp_record.otp != otp:
            raise serializers.ValidationError({'otp': 'Invalid verification code.'})

        return data

    def create(self, validated_data):
        validated_data.pop('otp', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        # Clean up OTP records for this email
        EmailOTP.objects.filter(email=validated_data['email']).delete()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'display_name', 'bio', 'created_at']
        read_only_fields = ['id', 'email', 'username', 'created_at']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')

        data['user'] = user
        return data

