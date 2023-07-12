from django.contrib import admin

from .models import EmbeddingTask, EmbeddingTaskAdmin, Content

admin.site.register(EmbeddingTask, EmbeddingTaskAdmin)
admin.site.register(Content)

