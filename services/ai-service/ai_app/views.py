import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from groq import Groq
from .analyzer import analyze_writing



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_blog(request):
    topic = request.data.get('topic')

    if not topic:
        return Response(
            {'error': 'Topic is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(topic) > 200:
        return Response(
            {'error': 'Topic must be under 200 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        api_key = os.getenv('GROQ_API_KEY')

        if not api_key:
            return Response(
                {'error': 'GROQ_API_KEY is not configured on the AI service'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        client = Groq(api_key=api_key)

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional blog writer. Write detailed, engaging, and well-structured blog posts. Include an introduction, main sections with headings, and a conclusion."
                },
                {
                    "role": "user",
                    "content": f"Write a detailed blog post about: {topic}"
                }
            ],
            max_tokens=1024,
            temperature=0.7,
        )

        generated_content = completion.choices[0].message.content

        return Response(
            {
                'topic': topic,
                'content': generated_content,
                'model': 'llama-3.3-70b-versatile',
                'generated_by': request.user.username
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {'error': f'AI generation failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_writing_view(request):
    content = request.data.get('content', '')

    if not content:
        return Response(
            {'error': 'Content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = analyze_writing(content)

    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    return Response(result, status=status.HTTP_200_OK)