from rest_framework import serializers
from .models import Post, Like


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'author_id',
            'author_username',
            'title',
            'content',
            'likes_count',
            'is_liked',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'author_id', 'author_username',
                           'likes_count', 'is_liked', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user:
            user_id = getattr(request.user, 'id', None)
            if user_id:
                return obj.likes.filter(user_id=user_id).exists()
        return False