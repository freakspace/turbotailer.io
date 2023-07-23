import time
import json

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

from langchain.llms import OpenAI

from django.conf import settings

from ...embeddings.vectorstore import Vectorstore
from .serializers import PromptSerializer
from ..prompts import product_comparison_prompt

class PromptsViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []
    
    # TODO Check if ID matches 
    # TODO Add exception handling etc
    @action(detail=False, methods=['post'])
    def prompt(self, request):
        # Search vectorstore
        # Call API endpoint and fetch products
        # Call LLM

        start_time = time.time()

        serializer = PromptSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({"error": "Try again"}, status=status.HTTP_400_BAD_REQUEST)
        
        query = request.data.get('query')
        namespace = request.data.get('namespace')
        
        vectorstore_instance = Vectorstore.get_instance()
        vectorstore = vectorstore_instance.get_vectorstore()

        search = vectorstore.similarity_search(
            query = query,
            namespace = namespace
        )

        products = [{"name": json.loads(product.page_content)["name"], "permalink": json.loads(product.page_content)["permalink"]} for product in search]

        context = json.dumps([json.loads(message.page_content) for message in search])

        prompt = product_comparison_prompt(context, query)

        llm = OpenAI(model_name="text-davinci-003", openai_api_key=settings.OPENAPI_KEY)
        
        llm_output = llm(prompt)

        end_time = time.time()

        elapsed_time = end_time - start_time

        print(f"It took {elapsed_time} seconds to get search result")
        
        response = {"text": llm_output, "products": products}

        return Response(response)


        

