
from typing import List, Optional

from django.conf import settings

from langchain.vectorstores import Pinecone
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
import pinecone


# TODO In case vectorstore doesnt exist but the products does as "Content", no vectors will be created.
# TODO When someone opens the chat, the vectorstore should be initialized async
# TODO Only use HUggingFace on local i guess
class Vectorstore:
    instance = None

    @staticmethod
    def get_instance():
        if Vectorstore.instance is None:
            print("Creating new Vectorstore instance")
            Vectorstore()
        
        print("Reusing exisiting Vectorstore instance")
        return Vectorstore.instance
    
    def __init__(self):
        if Vectorstore.instance is not None:
            raise Exception("This class is a singleton")
        else:
            self.embeddings = HuggingFaceEmbeddings(model_kwargs = {'device': 'cpu'})
            pinecone.init(
                    api_key=settings.PINECONE_API_KEY, 
                    environment=settings.PINECONE_ENVIRONMENT
                )
            index = pinecone.Index("demo")
            self.vectorstore = Pinecone(index, self.embeddings.embed_query, "text")
            Vectorstore.instance = self

    # TODO Maybe run everything vectorstore related inside this class
    def get_vectorstore(self):
        return self.vectorstore
    
    def add_texts(
        self,
        namespace: str,  
        texts: List[str], 
        metadatas: List[dict],
        batch_size: int
        ) -> List[int]:

        self.vectorstore.add_texts(
                texts=texts,
                metadatas=metadatas,
                namespace=namespace,
                batch_size=batch_size
            ) 

    def delete_vector(
        self,
        vector_ids: Optional[List[str]] = None, 
        delete_all: Optional[bool] = None,
        filter: Optional[dict] = None,
        namespace: str = None,
        ):
        
        if not namespace:
            raise Exception("You need to include namespace when deleting a vector")

        self.vectorstore.delete(
                ids=vector_ids, 
                delete_all=delete_all, 
                namespace=namespace,
                filter=filter
            )