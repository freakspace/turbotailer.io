from typing import List
import json
import logging
import time

from django.core.exceptions import BadRequest, PermissionDenied
from django.utils.translation import gettext_lazy as _

from requests_oauthlib import OAuth1Session


from langchain.docstore.document import Document

from turbotailer.utils.crypto import decrypt_message
from turbotailer.utils.utils import num_tokens_text

# Define a logger
logger = logging.getLogger(__name__)


# TODO Initialize connector with channels (products, categories etc.)
# TODO Check for https / http and change auth depending on it
# TODO Prepare keys for each of the channels
class WoocommerceConnector:
    def __init__(
            self, 
            base_url: str, 
            channels: List[str],
            consumer_key: str, 
            consumer_secret: str, 
            per_page: int
            ):
        
        self.base_url = base_url
        self.channels = channels
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.per_page = per_page
        self.connection = None

    @classmethod
    def from_model(cls, store_id):
        from turbotailer.stores.models import Store
        store = Store.objects.get(id=store_id)
        # TODO 32 should be set as store object?
        return cls(
            store.store_type.base_url, 
            [channel.channel for channel in store.channels.all()],
            store.store_type.consumer_key, 
            store.store_type.consumer_secret, 
            32)
    
    def print_all(self):
        print(self.__dict__)

    def validate_initialization(self):
        """ Checks that class got all information """
        for attr, value in self.__dict__.items():
            if attr != 'connection' and not value:
                raise ValueError(f"Attribute {attr} was not initialized")
        print("All attributes were properly initialized.")

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


    def ping(self):
        if not self.connection:
            self.connect()

        url = self.base_url + '/wp-json/wc/v3'

        response = self.connection.get(url)

        return response


    def get_products(self):
        PRODUCTS_ENDPOINT = "/wp-json/wc/v3/products"
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
    
    async def calculate_tokens(self):
        # TODO Check how many pages. If more than 10, calculate an averate
        num_tokens = 0
        item_count = 0
        print("Calculating tokens..")

        for channel in self.channels:
            print(f"Calculating for {channel}")
            method_name = f"get_{channel}"
            # Get the appropriate method for each channel
            
            if hasattr(self, method_name):
                print("Found attribute")
                items = getattr(self, method_name)()
                # Loop through each of the items (products, categories etc)
                for item in items:
                    num_tokens += num_tokens_text(json.dumps(item))

                    item_count += 1

                    yield f"{num_tokens},"

                    """ if item_count == 50:
                        break """
    
    async def generator(self):
        num = 1
        for a in range(0,10):
            yield num
            num += a
            time.sleep(2)
