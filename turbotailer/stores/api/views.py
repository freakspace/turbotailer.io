# TODO Create store
# TODO Update store
# TODO Delete store

# TODO Get store types

# TODO Create store type (Save type to store, can be blank)
# TODO Delete store type
# TODO Update store type

from urllib.parse import urlparse

from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import GenericViewSet


from ..api.serializers import (
    CreateWoocommerceStoreSerializer, 
    UpdateWoocommerceStoreSerializer, 
    CreateChannelSerializer, 
    GetChannelFieldsSerializer,
    SetChannelFieldsSerializer,
    StoreSerializer
    )
from ..models import Store, WooCommerceStore, Channel
from ...utils.crypto import encrypt_message
from ...utils.utils import is_valid_uuid, sanitize_url
from turbotailer.embeddings.connectors.woocommerce import WoocommerceConnector


# TODO Changing channel fields will need a complete re-embedding. Will automatically happen at next re-embed.
#  


class StoresViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def get_queryset(self):
        return Store.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_woocommerce(self, request):
        serializer = UpdateWoocommerceStoreSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:

            store_id = request.data.get('store_id')

            if not is_valid_uuid(store_id):
                return Response({"error": "Provided ID is not of valid type (UUID)"})

            if not store_id:
                return Response({"error": "Missing store ID"})
            
            try:
                store = Store.objects.get(id=store_id)
                woo = WooCommerceStore.objects.get(id=store.object_id)
            except Store.DoesNotExist:
                return Response({"error": "Store doesn't exist"})


            if store.user != request.user:
                return Response({"error": "You are not the owner of that store"})

            consumer_key = request.data.get('consumer_key')
            consumer_secret = request.data.get('consumer_secret')
            store_name = request.data.get('store_name')
            base_url = request.data.get('base_url')

            if store_name is not None:
                store.name = store_name

            if consumer_key is not None:
                signed_consumer_key = encrypt_message(consumer_key)
                woo.consumer_key = signed_consumer_key

            if consumer_secret is not None:
                woo.consumer_secret = encrypt_message(consumer_secret)
            
            if base_url is not None:
                woo.base_url = base_url

            try:
                with transaction.atomic():
                    woo.save()
                    store.save()
            except Exception as e:
                return Response({"error": f"Error updating store: {e}"})

            return Response({"message": f"WooCommerce store updated succesfully"})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)


    @action(detail=False, methods=['post'])
    def create_woocommerce(self, request):
        # TODO Need more validation, should not be possible to create more than 1 store?
        serializer = CreateWoocommerceStoreSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:
            store_name = request.data.get('store_name')
            consumer_key = request.data.get('consumer_key')
            consumer_secret = request.data.get('consumer_secret')
            base_url = request.data.get('base_url')
            
            sanitized_url = sanitize_url(base_url)

            try:
                with transaction.atomic():
                    woo = WooCommerceStore.objects.create(
                        consumer_key = encrypt_message(consumer_key) if consumer_key else None,
                        consumer_secret = encrypt_message(consumer_secret) if consumer_secret else None,
                        base_url = sanitized_url
                    )

                    woo_content_type = ContentType.objects.get_for_model(WooCommerceStore)

                    store = Store.objects.create(
                        user=request.user,
                        name=store_name,
                        content_type=woo_content_type,
                        object_id=woo.id
                    )

            except Exception as e:
                return Response({"error": f"Error creating store: {e}"})

            return Response({"message": f"WooCommerce store created succesfully", "store_id": store.id})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
    
    @action(detail=False, methods=['post'])
    def create_channel(self, request):
        serializer = CreateChannelSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:

            store_id = request.data.get('store_id')

            if not is_valid_uuid(store_id):
                return Response({"error": "Provided ID is not of valid type (UUID)"})

            try:
                store = Store.objects.get(id=store_id)
            except Store.DoesNotExist:
                return Response({"error": "Store doesn't exist"})

            
            if store.user != request.user:
                return Response({"error": "You are not the owner of that store"})
            
            channels = serializer.validated_data['channels']


            created = 0

            for channel in channels:
                name = channel.get("name")
                fields = channel.get("fields")
                try:
                    Channel.objects.get(store=store, channel=name)
                except Channel.DoesNotExist:
                    Channel.objects.create(
                        store=store, 
                        channel=name,
                        fields=fields
                    )

                    created += 1

            return Response({"message": f"{created} out of {len(channels)} channels created succesfully"})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        

    @action(detail=False, methods=['post'])
    def get_channel_fields(self, request):
        # TODO Create multiple at one time
        serializer = GetChannelFieldsSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:

            channel_id = request.data.get('channel_id')

            if not is_valid_uuid(channel_id):
                return Response({"error": "Provided ID is not of valid type (UUID)"})

            try:
                channel = Channel.objects.get(id=channel_id)
            except Channel.DoesNotExist:
                return Response({"error": "Channel doesn't exist"})

            
            if channel.store.user != request.user:
                return Response({"error": "You are not the owner of that store"})
            
            return Response(channel.get_available_fields())

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
    
    @action(detail=False, methods=['post'])
    def set_channel_fields(self, request):
        serializer = SetChannelFieldsSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:

            channel_id = request.data.get('channel_id')
            fields = request.data.get('fields')

            if not is_valid_uuid(channel_id):
                return Response({"error": "Provided ID is not of valid type (UUID)"})

            try:
                channel = Channel.objects.get(id=channel_id)
            except Channel.DoesNotExist:
                return Response({"error": "Channel doesn't exist"})

            
            if channel.store.user != request.user:
                return Response({"error": "You are not the owner of that store"})
            

            channel.fields = list(set(channel.fields + fields))
            channel.save()

            return Response({f"message": "Fields updated:"})

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    

    @action(detail=False, methods=['post'])
    def get_available_channels_and_fields(self, request):

        if request.user.is_authenticated:

            store_id = request.data.get('store_id')

            if not is_valid_uuid(store_id):
                return Response({"error": "Provided ID is not of valid type (UUID)"})

            try:
                store = Store.objects.get(id=store_id)
            except Channel.DoesNotExist:
                return Response({"error": "Store doesn't exist"})

            
            if store.user != request.user:
                return Response({"error": "You are not the owner of that store"})

            return Response(store.store_type.optional_fields())

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        

    @action(detail=False, methods=['get'])
    def get_user_stores(self, request):
        print("CALLING STORE ENDPOINT")
        if request.user.is_authenticated:
            try:
                stores = Store.objects.filter(user=request.user)
                serializer = self.get_serializer(stores, many=True)
            except Store.DoesNotExist:
                return Response({"error": "Store doesn't exist"})
            return Response(serializer.data)

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
        
    
    @action(detail=False, methods=['post'])
    def ping_connection(self, request):
        store_id = request.data.get('store_id')

        if request.user.is_authenticated:
            try:
                store = Store.objects.filter(user=request.user, id=store_id).get()
            except Store.DoesNotExist:
                    return Response({"error": "Store doesn't exist"})

            try:

                # Get the connection class
                connector = store.store_type.get_connection_class()

                # Init the connection
                woocommerce = connector.from_model(store_id)

                response = woocommerce.ping()

                if response.status_code == 200:
                    return Response({"message": "Connection Established"})
                else:
                    return Response({"error": "We can't establish a connection to the store"}, status=status.HTTP_401_UNAUTHORIZED)

            except:

                return Response({"error": "We can't establish a connection to the store"}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({"error": "You are not authenticated!"}, status=status.HTTP_401_UNAUTHORIZED)
    
