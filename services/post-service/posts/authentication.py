from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class SimpleUser:
    def __init__(self, user_id, username):
        self.id = user_id
        self.username = username
        self.is_authenticated = True


class NoDBJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None
        raw_token = self.get_raw_token(header)
        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception as e:
            raise
        return self.get_user(validated_token), validated_token

    def get_user(self, validated_token):
        try:
            user_id = int(validated_token['user_id'])
            username = validated_token.get('username', '')
            return SimpleUser(user_id, username)
        except KeyError:
            raise InvalidToken('No user_id in token')