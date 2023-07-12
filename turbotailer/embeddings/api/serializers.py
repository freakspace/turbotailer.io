from rest_framework import serializers

class NamespaceSerializer(serializers.Serializer):
    namespace = serializers.CharField(max_length=200)
