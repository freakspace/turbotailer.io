from rest_framework import serializers

class NamespaceSerializer(serializers.Serializer):
    namespace = serializers.CharField(max_length=200)

class CreateEmbeddingTaskSerializer(serializers.Serializer):
    store_id = serializers.CharField(max_length=255)
    channels = serializers.ListField(
        child=serializers.CharField(max_length=255)
    )
