from pytz import UTC
from datetime import datetime

from django.contrib import admin
from django.utils import timezone
from django.db import transaction
from django.utils import timezone

from turbotailer.embeddings.tasks import create_batch
from turbotailer.embeddings.models import EmbeddingTask



def create_vector_batches(embedding_task: EmbeddingTask):
    from turbotailer.embeddings.models import Content, VectorTask

    embedding_task.status = "In progress"
    embedding_task.save()

    fields = embedding_task.channel.get_available_fields()

    keys =  {**fields["selected"], **fields["required"]}
    
    batch_size = 32

    # TODO Has to take the channel in to consideration
    # Get the connection class
    connector = embedding_task.channel.store.store_type.get_connection_class()
    
    # Init the connection
    woocommerce = connector.from_model(embedding_task.channel.store.id)
    
    # Make connection
    try:
        woocommerce.connect()
    except Exception as e:
        embedding_task.message = e
        embedding_task.status = "Failed"
        embedding_task.save()
        return # Return error?

    # Get products from endpoint
    try:
        products = woocommerce.get_products()
    except Exception as e:
        # TODO Add message to task
        embedding_task.message = e
        embedding_task.status = "Failed"
        embedding_task.save()
        return # Return error?

    document_batch = []

    count = 0
    stop_after = None
    for product in products:
        count += 1
        # TODO The create document should also be dependent on connector
        document = woocommerce.create_document(item=product, keys=keys)
        try:
            with transaction.atomic():
                try:
                    content = Content.objects.get(
                        channel=embedding_task.channel, 
                        store=embedding_task.channel.store, 
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
                        channel=embedding_task.channel,
                        store=embedding_task.channel.store,
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
                store_id=str(embedding_task.channel.store.id)
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
                store_id=str(embedding_task.channel.store.id)
                )

    # Save status to embedding task
    embedding_task.status = "Complete"
    embedding_task.save()