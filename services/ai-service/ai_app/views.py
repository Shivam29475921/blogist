import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
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

        model_name = os.getenv('GROQ_MODEL', 'openai/gpt-oss-120b')

        llm = ChatGroq(
            groq_api_key=api_key,
            model_name=model_name,
            temperature=0.7,
            max_tokens=2048,
        )

        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are an expert research assistant for writers and journalists. "
                "Provide detailed, factual, and well-organized research notes on the requested topic. "
                "Structure your response with clear markdown headings, key historical context, critical facts, "
                "notable arguments or perspectives, and essential takeaways that a writer can reference."
            ),
            (
                "human",
                "Research the following topic thoroughly: {topic}"
            )
        ])

        chain = prompt | llm | StrOutputParser()
        generated_content = chain.invoke({"topic": topic})

        return Response(
            {
                'topic': topic,
                'content': generated_content,
                'model': model_name,
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