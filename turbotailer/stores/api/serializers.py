from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from turbotailer.stores.models import Store, WooCommerceStore, Channel

class CreateWoocommerceStoreSerializer(serializers.Serializer):
    store_name = serializers.CharField(max_length=255)
    consumer_key = serializers.CharField(max_length=255, required=False)
    consumer_secret = serializers.CharField(max_length=255, required=False)
    base_url = serializers.CharField(max_length=255, required=False)


class UpdateWoocommerceStoreSerializer(serializers.Serializer):
    store_id = serializers.CharField(max_length=255, required=False)
    store_name = serializers.CharField(max_length=255, required=False)
    consumer_key = serializers.CharField(max_length=255, required=False)
    consumer_secret = serializers.CharField(max_length=255, required=False)
    base_url = serializers.CharField(max_length=255, required=False)


class IChannelSerializer(serializers.Serializer):
    channel = serializers.CharField(max_length=255)
    fields = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )

class CreateChannelSerializer(serializers.Serializer):
    store_id = serializers.CharField(max_length=255)
    channels = IChannelSerializer(many=True)

class GetChannelFieldsSerializer(serializers.Serializer):
    channel_id = serializers.CharField(max_length=255)

class SetChannelFieldsSerializer(serializers.Serializer):
    channel_id = serializers.CharField(max_length=255)
    fields = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )


class WooCommerceStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = WooCommerceStore
        fields = ['consumer_key', 'consumer_secret', 'base_url']


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):

    store_type = serializers.SerializerMethodField()
    channels = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Store
        fields = '__all__'

    def get_store_type(self, obj):
        if isinstance(obj.store_type, WooCommerceStore):
            return WooCommerceStoreSerializer(obj.store_type).data
        # Add similar condition for every possible type of store_type
        # ...
        # else return None or some default value
        return None






