from typing import List, Any
from pytz import UTC
from datetime import datetime

from django.utils import timezone
from django.db import transaction
from django.utils import timezone
from django.contrib import admin

from turbotailer.embeddings.tasks import create_batch


# TODO when i parse the products i need to check they conform with the schema, otherwise skip.
# TODO I need to check if the integration is up and running
@admin.action(description='Query products from endpoint')
def admin_get_products(self, request, queryset):

    from turbotailer.embeddings.models import Content, VectorTask
    
    # TODO Filter only active stores
    # TODO Filter only active integrations
    # TODO Filter for channel (all fields has to be set)
    for obj in queryset:

        # vectorstore_instance = Vectorstore.get_instance()

        obj.status = "In progress"
        obj.save()

        # TODO Refactor
        # keys_data = obj.channel.get_available_fields()
        # keys =  keys_data["selected"] + keys_data["required"]

        keys = {
            "short_description": None, 
            "name": None,
            "description": None,
            "sku": None,
            "price": None,
            "regular_price": None,
            "on_sale": None,
            "categories": ["name"],
            "images": ["name", "src", "alt"],
            "attributes": ["name", "options"],
            "id": None,
            "permalink": None,
            "date_modified_gmt": None
        }
        
        batch_size = 32

        # TODO Has to take the channel in to consideration

        # Get the connection class
        connector = obj.channel.store.store_type.get_connection_class()
        
        # TODO This has to be refactored and put in the class, i guess?
        woocommerce = connector(
            base_url=obj.channel.store.store_type.base_url,
            consumer_key=obj.channel.store.store_type.consumer_key, 
            consumer_secret=obj.channel.store.store_type.consumer_secret,
            per_page=batch_size
            )
        
        # Make connection
        try:
            woocommerce.connect()
        except Exception as e:
            obj.message = e
            obj.status = "Failed"
            obj.save()
            break

        # Get products from endpoint
        try:
            products = woocommerce.get_products()
        except Exception as e:
            # TODO Add message to task
            obj.message = e
            obj.status = "Failed"
            obj.save()
            break

        document_batch = []

        count = 0
        stop_after = 352
        for product in products:
            count += 1
            # TODO The create document should also be dependent on connector
            document = woocommerce.create_document(item=product, keys=keys)
            try:
                with transaction.atomic():
                    try:
                        content = Content.objects.get(
                            channel=obj.channel, 
                            store=obj.channel.store, 
                            identifier=document.metadata["id"]
                            )
                        last_updated = datetime.fromisoformat(document.metadata["date_modified_gmt"])
                        last_updated_tz = timezone.make_aware(last_updated, timezone=UTC)
                        # Skip content that's not updated
                        if content.updated < last_updated_tz:
                            content.updated = timezone.now()
                            content.save()
                            # Need a reference for document when creating chunks
                            document = woocommerce.update_document_metadata(
                                document=document, 
                                data={
                                    "content_id": str(content.id), 
                                    "updated": True
                                    }
                                )
                            
                            document_batch.append(document)
                    except Content.DoesNotExist:

                        content = Content.objects.create(
                            channel=obj.channel,
                            store=obj.channel.store,
                            identifier=document.metadata["id"],
                            updated=timezone.now(),
                        )
                        document = woocommerce.update_document_metadata(
                                document=document, 
                                data={
                                    "content_id": str(content.id), 
                                    }
                                )
                        document_batch.append(document)

            except Exception as e:
                print(f"Error occurred A: {e}")

            if len(document_batch) == batch_size:

                texts = [doc.page_content for doc in document_batch]
                metadatas = [doc.metadata for doc in document_batch]
                
                create_batch.delay(
                    texts=texts,
                    metadatas=metadatas, 
                    store_id=str(obj.channel.store.id)
                    )
                
                # Reset batches
                document_batch = []
            
            if stop_after and count == stop_after:
                break

        # Check for products that didnt make a batch
        if document_batch:
            texts = [doc.page_content for doc in document_batch]
            metadatas = [doc.metadata for doc in document_batch]

            """ VectorTask.objects.create(
                messages=
            ) """
            create_batch.delay(
                    texts=texts,
                    metadatas=metadatas, 
                    store_id=str(obj.channel.store.id)
                    )

        # Save status to embedding task
        obj.status = "Complete"
        obj.save()
    self.message_user(request, "Done")