from typing import List
import json
import logging

from django.core.exceptions import BadRequest, PermissionDenied
from django.utils.translation import gettext_lazy as _

from requests_oauthlib import OAuth1Session


from langchain.docstore.document import Document

from turbotailer.utils.crypto import decrypt_message

# Define a logger
logger = logging.getLogger(__name__)

# Define the API endpoint as a constant
PRODUCTS_ENDPOINT = "/wp-json/wc/v3/products"

# TODO Initialize connector with channels (products, categories etc.)
# TODO Check for https / http and change auth depending on it
class WoocommerceConnector:
    def __init__(
            self, 
            base_url: str, 
            consumer_key: str, 
            consumer_secret: str, 
            per_page: int
            ):
        
        self.base_url = base_url
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.per_page = per_page
        self.connection = None

    def connect(self):

        if self.connection:
            logger.info("Using existing connection")
            return
        
        try:
            consumer_key = decrypt_message(self.consumer_key)
            consumer_secret = decrypt_message(self.consumer_secret)
            self.connection =  OAuth1Session(consumer_key, consumer_secret)
        except Exception as e:
            logger.error(e)
            raise PermissionDenied(_("Incorrect API keys"))

    def get_products(self):
        # Starts page at
        page_number = 1

        # Try to connect if there's no connection yet
        if not self.connection:
            self.connect()
        
        while True:
            url = f"{self.base_url}{PRODUCTS_ENDPOINT}?per_page={self.per_page}&page={page_number}"

            logger.info(f"Calling: {url}")

            response = self.connection.get(url)

            if response.status_code == 200:
                products =  response.json()
                
                for product in products:
                    yield product

                if len(products) < self.per_page:
                    break
                    
                page_number += 1
            else:
                logger.error(f"Server responded with status {response.status_code}: {response.text}")
                
                if response.status_code == 400:
                    raise BadRequest(_("Invalid request"))
                elif response.status_code == 401:
                    raise PermissionDenied(_("Incorrect API keys"))
                elif response.status_code == 404:
                    raise Exception(_("The resource can not be found"))
                elif response.status_code == 500:
                    raise Exception(_("Server error"))
                else:
                    raise Exception(_("Unknown error"))
    
    def extract_data(self, item: dict, keys: List[str]):
            extracted_data = {}
            for key, subkeys in keys.items():
                
                if subkeys is None:  # No subkeys, just extract the value directly
                    if item.get(key):
                        extracted_data[key] = item.get(key)
                
                else:
                    nested_items = item.get(key, [])
                    extracted_data[key] = []
                    for nested_item in nested_items:
                        #print(subkeys)
                        nested_data = None
                        for subkey in subkeys:
                            if nested_item.get(subkey):
                                #print(subkey)
                                if isinstance(nested_item.get(subkey), list):
                                    if key == "attributes":
                                        nested_data = nested_item["name"] + ": " + ", ".join(nested_item.get(subkey))
                                    else:
                                        nested_data = subkey + ": " + ", ".join(nested_item.get(subkey))
                                else:
                                    nested_data = subkey +  ": " + nested_item.get(subkey)
                        extracted_data[key].append(nested_data)

            return extracted_data

    def create_document(self, item: dict, keys: List[str]):
        # Keys to add to metadata
        metadata_keys = {"id": {"pass_as_content": False}, "categories": {"pass_as_content": True}, "date_modified_gmt": {"pass_as_content": False}}

        metadata = {}
        content = {}
        
        extracted_data = self.extract_data(item = item, keys = keys)

        # TODO Data can be improved further by removing unused keys/names
        for key, value in extracted_data.items():
            if key in metadata_keys:
                metadata[key] = value
                if metadata_keys[key]["pass_as_content"]:
                    content[key] = value
            else:
                content[key] = value
        
        # Stringify dicts and add as the content
        page_content = json.dumps(content)

        # Generate document
        document = Document(page_content=page_content, metadata=metadata)

        return document

    def update_document_metadata(self, document: Document, data: dict):

        for key, value in data.items():
            if not value:
                del document.metadata[key]
            else:
                document.metadata[key] = value

        return document