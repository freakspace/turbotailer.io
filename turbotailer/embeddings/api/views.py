import logging

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.http import StreamingHttpResponse

from ..models import EmbeddingTask, Channel
from turbotailer.stores.models import Store

from ..vectorstore import Vectorstore

from ..api.serializers import NamespaceSerializer, CreateEmbeddingTaskSerializer

from ...utils.utils import is_valid_uuid


logger = logging.getLogger(__name__)


class EmbeddingsViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
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
    
    @action(detail=False, methods=['post'])
    def create_task(self, request):

        serializer = CreateEmbeddingTaskSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:

            store_id = request.data.get('store_id')
            channels = request.data.get('channels') 

            try:
                store = Store.objects.get(user=request.user, pk=store_id)
            except Store.DoesNotExist:
                return Response({"error": "Store doesn't exists"}, status=status.HTTP_400_BAD_REQUEST)

            for channel_id in channels:

                count = 0
                
                try:
                    channel_instance = Channel.objects.get(id=channel_id, store=store)
                except Channel.DoesNotExist:
                    logger.error(f"Unable to find channel '{channel_id}' for store {store}")
                    continue

                if channel_instance.store.user != request.user:
                    return Response({"error": "You are not the owner of that channel!"}, status=status.HTTP_400_BAD_REQUEST)

                # Check for existing tasks
                existing_task = EmbeddingTask.objects.filter(channel=channel_instance, status__in=["In progress", "Pending"])
                
                # Skip existing tasks
                if existing_task:
                    continue
                
                try:
                    EmbeddingTask.objects.create(
                        user = request.user,
                        channel = channel_instance
                    )
                    count += 1
                except Exception as e:
                    logger.error(f'Unable to create embedding task with the following error: {e}')
                
            return Response({"message": f"{count} / {len(channels)} tasks created."})
        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'])
    def calculate_tokens(self, request):

        from turbotailer.stores.models import Store

        store_id = request.data.get('store_id')

        if request.user.is_authenticated:
            
            try:
                store = Store.objects.filter(user=request.user, id=store_id).get()
            except Store.DoesNotExist:
                return Response({"error": "Store doesn't exist"})

            try:
                # Get the connection class
                connector = store.store_type.get_connection_class()
                
                woo = connector.from_model(store_id)

                response =  StreamingHttpResponse(woo.calculate_tokens())

                return response

        
            except Exception as e:
                return Response({"error": f"{e}"}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
