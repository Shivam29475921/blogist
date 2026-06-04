from django.db import models


class Comment(models.Model):
    post_id = models.IntegerField()
    author_id = models.IntegerField()
    author_username = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.author_username} on post {self.post_id}'