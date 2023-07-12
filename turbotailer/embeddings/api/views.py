import uuid

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from ..models import EmbeddingTask, Channel

from ..vectorstore import Vectorstore

from ..api.serializers import NamespaceSerializer

from ...utils.utils import is_valid_uuid

class EmbeddingsViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        """ Returns a message to all GET requests for a single object """
        # Here you can handle `pk` to get an object from your database
        # For now we just ignore `pk` and return a simple message
        return Response({"message": "Hello, world!"})
    
    @action(detail=False, methods=['post'])
    def destroy_all(self, request):

        serializer = NamespaceSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        namespace = request.data.get('namespace')
        
        if not namespace or not isinstance(namespace, str):
            return Response({"error": "You must provide a namespace."}, status=status.HTTP_400_BAD_REQUEST)
        
        """ Destroy all vectors """
        if request.user.is_authenticated:

            # TODO Delete content as well?
            vectorstore_instance = Vectorstore.get_instance()

            # vectorstore = vectorstore_instance.get_vectorstore()
            vectorstore_instance.delete_vector(delete_all=True, namespace=namespace)
            
            return Response({"message": "chunks deleted"})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)


    @action(detail=False, methods=['post'])
    def destroy_by_list(self, request):
        """ Destroy multiple vectors """
        if request.user.is_authenticated:
            vector_ids = request.data.get('vector_ids')
            if not vector_ids or not isinstance(vector_ids, list):
                return Response({"error": "You must provide a list of ids."}, status=status.HTTP_400_BAD_REQUEST)
            
            for vector_id in vector_ids:
                if not is_valid_uuid(vector_id):
                    return Response({"error": f"{vector_id} is not a valid uuid"}, status=status.HTTP_400_BAD_REQUEST)
            vectorstore_instance = Vectorstore.get_instance()
            vectorstore = vectorstore_instance.get_vectorstore()
            vectorstore.delete_vector(vector_ids=vector_ids)

            return Response({"message": f"Chunks deleted"})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    

    def destroy(self, request, pk=None):
        """ Destroy a single vector """
        if request.user.is_authenticated:
            
            if not is_valid_uuid(pk):
                return Response({"error": f"{pk} is not a valid uuid"}, status=status.HTTP_400_BAD_REQUEST)
            
            vectorstore_instance = Vectorstore.get_instance()
            vectorstore = vectorstore_instance.get_vectorstore()
            vectorstore.delete_vector([str(pk)])

        return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    

    def create(self, request):
        if request.user.is_authenticated:

            channel_id = request.data.get('channel_id')

            if not is_valid_uuid(channel_id):
                return Response({"error": "You need to pass a uuid as id"}, status=status.HTTP_400_BAD_REQUEST)

            if channel_id is not None:
                channel = Channel.objects.get(id=channel_id)

                if channel.store.user != request.user:
                    return Response({"error": "You are not the owner of that channel!"}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    EmbeddingTask.objects.create(
                        user = request.user,
                        channel = channel
                    )
                    return Response({"message": "Embedding task created"})
                except Exception as e:
                    return Response({
                        "error": str(e)
                    }, status=status.HTTP_400_BAD_REQUEST)

            return Response({"error": "No channel found"})
        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        

# TODO Create user
# TODO Delete user
# TODO Update user