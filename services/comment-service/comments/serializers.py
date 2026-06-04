from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id',
            'post_id',
            'author_id',
            'author_username',
            'content',
            'created_at'
        ]
        read_only_fields = ['id', 'author_id', 'author_username', 'created_at']