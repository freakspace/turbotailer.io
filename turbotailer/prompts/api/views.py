import time

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets

from ...embeddings.vectorstore import Vectorstore
from .serializers import PromptSerializer

class PromptsViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []
    
    # TODO Check if ID matches 
    @action(detail=False, methods=['post'])
    def prompt(self, request):
        print("Prompting")
        serializer = PromptSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "Try again"})
        
        query = request.data.get('query')
        namespace = request.data.get('namespace')
        start_time = time.time()
        vectorstore_instance = Vectorstore.get_instance()
        vectorstore = vectorstore_instance.get_vectorstore()
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"It took {elapsed_time} seconds to initiate vectorstore")
        search = vectorstore.similarity_search(
            query = query,
            namespace = namespace
        )
        print(search)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"It took {elapsed_time} seconds to get search result")

        return Response({"message": [message.page_content for message in search]})
    

    # TODO Check if ID matches 
    @action(detail=False, methods=['get'])
    def test(self, request):
        response = Response({"message": "Prompter"})
        response["Access-Control-Allow-Origin"] = "*"
        return response


        

