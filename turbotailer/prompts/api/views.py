import time
import json

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

from langchain.llms import OpenAI

from django.conf import settings

from .serializers import PromptSerializer
from turbotailer.prompts.agent import get_agent
from turbotailer.prompts.memory import MessageSessionStorage

class PromptsViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []
    
    @action(detail=False, methods=['post'])
    def prompt(self, request):
        start_time = time.time()

        serializer = PromptSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({"error": "Try again"}, status=status.HTTP_400_BAD_REQUEST)
        
        query = request.data.get('query')
        namespace = request.data.get('namespace')

        llm = OpenAI(model_name="text-davinci-003", openai_api_key=settings.OPENAPI_KEY)

        agent = get_agent(llm=llm, namespace=namespace, memory=MessageSessionStorage(request=request))

        output = agent.run(query)

        end_time = time.time()

        elapsed_time = end_time - start_time

        print(f"It took {elapsed_time} seconds to get search result")
        
        response = {"text": output, "products": []}

        return Response(response)


        

