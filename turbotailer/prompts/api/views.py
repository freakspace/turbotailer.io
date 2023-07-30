import time
import json

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

import langchain

langchain.debug = True

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

        llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=settings.OPENAPI_KEY)

        agent = get_agent(
            llm=llm, 
            namespace=namespace, 
            memory=MessageSessionStorage(request=request)
            )

        output = agent.run(input=query)

        end_time = time.time()

        elapsed_time = end_time - start_time

        print(f"It took {elapsed_time} seconds to get search result")
        
        # response = {"text": output, "products": []}

        return Response(output)
    

    @action(detail=False, methods=['get'])
    def message_history(self, request):

        key = "chat_history"

        history = request.session.get(key)

        if history:

            items = [json.loads(message) for message in request.session.get(key)]

            response = {"chat_history": items}
            print("KIG")
            return Response(response)
        else:
            return Response({"chat_history": []})
    

    @action(detail=False, methods=['post'])
    def delete_message_history(self, request):

        key = "chat_history"

        if key in request.session:
            del request.session[key]

            return Response("Message history deleted")
        
        return Response("Message history could not be deleted", status=status.HTTP_400_BAD_REQUEST)
    


        

