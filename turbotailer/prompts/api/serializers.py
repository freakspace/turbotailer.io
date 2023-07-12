from rest_framework import serializers

class PromptSerializer(serializers.Serializer):
    namespace = serializers.CharField(max_length=200)
    query = serializers.CharField(max_length=200)
