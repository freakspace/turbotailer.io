from typing import List

from celery import shared_task

from turbotailer.embeddings.vectorstore import Vectorstore

@shared_task(soft_time_limit=600)
def create_batch(
        texts: List[str], 
        metadatas: List[dict],
        store_id: str
        ):
    
    vectorstore_instance = Vectorstore.get_instance()

    # Delete all vectors that matches content_id
    vectors_to_delete = set()
    for metadata in metadatas:
        try:
            updated = metadata["updated"] 
            if updated == True:
                vectors_to_delete.add(metadata["content_id"])
        except KeyError:
            pass

    # Vectors for existing content will be deleted
    if vectors_to_delete:
        for content_id in list(vectors_to_delete):
            vectorstore_instance.delete_vector(filter={"content_id": content_id}, namespace=store_id)

    # Add texts to vectorstore
    vectorstore_instance.add_texts(
        namespace=store_id,
        texts=texts,
        metadatas=metadatas,
        batch_size=32
    )
