from django.contrib import admin

from turbotailer.embeddings.loader import create_vector_batches

# TODO when i parse the products i need to check they conform with the schema, otherwise skip.
# TODO I need to check if the integration is up and running
# TODO Currently hardcoded for products.. Need to check for channels.
@admin.action(description='Query products from endpoint')
def admin_create_batches(self, request, queryset):

    for obj in queryset:
        create_vector_batches(embedding_task=obj)
        
    self.message_user(request, "Done")