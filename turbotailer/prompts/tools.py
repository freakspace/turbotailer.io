import json

from langchain import PromptTemplate, LLMChain
from langchain.vectorstores import Pinecone
from langchain.vectorstores.utils import DistanceStrategy
from langchain.chains import LLMChain
from langchain.tools import BaseTool
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.schema.language_model import BaseLanguageModel

from pydantic import BaseModel, Field

import pinecone

openai_api_key="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"

embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

pinecone.init(api_key="86860589-891d-4c83-897e-b42f2c4e21e7", environment="us-west4-gcp-free")


class BaseProductSearchTool(BaseModel):
    """Base class for tools that use a VectorStore."""

    llm: BaseLanguageModel = Field()
    namespace: str = Field(description="The index to use for the product search")

    class Config(BaseTool.Config):
        """Configuration for this pydantic object."""

        arbitrary_types_allowed = True


class ProductSearch(BaseProductSearchTool, BaseTool):
    name = "Product Search"
    description = "use this tool when you need to search for product recommendations for a customer"

    def _run(self, query: str):
        index = pinecone.Index("turbotailer")

        vectorstore = Pinecone(
            index=index, 
            embedding_function=embeddings.embed_query, 
            text_key="text",
            distance_strategy=DistanceStrategy.COSINE
        )

        search = vectorstore.similarity_search(
                    query = query,
                    namespace = self.namespace
                )
        
        context = [{"name": doc_content["name"], "description": doc_content["description"]} 
           for doc in search 
           for doc_content in [json.loads(doc.page_content)]]
        
        template = "Make a concise summary of each of the following products: {products}"
        
        prompt=PromptTemplate.from_template(template)
        
        # TODO self.llm untested
        chain = LLMChain(
                llm = self.llm, prompt=prompt,
           )

        return chain.run(context)
    
    def _arun(self, query: str):
        raise NotImplementedError("This tool does not support async")
