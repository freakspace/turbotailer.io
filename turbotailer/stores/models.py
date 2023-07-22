
import uuid

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _
from django.db.models.fields.json import JSONField

from turbotailer.embeddings.connectors.woocommerce import WoocommerceConnector


STORE_STATUS = (
    ("Inactive", _("Inactive")),
    ("Active", _("Active")),
)

MODELS = (
    ("GPT3", _("GPT3")),
)

STORES = (
    ("woocommerce", _("WooCommerce")),
    ("magento", _("Magento 2")),
    ("shopify", _("Shopify")),
    ("prestashop", _("Prestashop")),
)

CHANNELS = (
    ("products", _("Products")),
    #("categories", _("Categories")),
    #("orders", _("Orders")),
)


User = get_user_model()

class Store(models.Model):
    """ Represents one storefront, for example Shopify da_DK """
    # chunk_size = models.IntegerField(default=500)
    # chunk_overlap = models.IntegerField(default=0)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, 
        on_delete=CASCADE, 
        related_name='stores',
        verbose_name=_("User")
        )
    name = models.CharField(
        _("Store name"), 
        max_length=255
        )
    is_active = models.BooleanField(
        _("Store status"), 
        default=False
        )
    model = models.CharField(
        _("Model"), 
        choices=MODELS,
        max_length=255,
        null=True,
        blank=True
        )
    temperature = models.FloatField(_("Temperature"), default=0)
    max_tokens = models.IntegerField(_("Max tokens"), default=256)
    store_size = models.FloatField(_("Store size"), default=0)
    max_store_size = models.IntegerField(_("Max store size"), default=0) # TODO Unsure what sizes we are talking about

    openai_key = models.CharField(max_length=255, null=True, blank=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    store_type = GenericForeignKey('content_type', 'object_id')

class WooCommerceStore(models.Model):
    consumer_key = models.CharField(max_length=255, null=True, blank=True)
    consumer_secret = models.CharField(max_length=255, null=True, blank=True)
    base_url = models.CharField(max_length=255, null=True, blank=True)
    connection_class = WoocommerceConnector

    def get_connection_class(self):
        return self.connection_class
    
    def optional_fields(self):
        return [{
            "channel": "products",
            "fields": {
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
                "date_modified_gmt": None },
            },{
            "channel": "pages",
            "fields": {},
            },{
            "channel": "posts",
            "fields": {},
            }]
    
    def required_fields(self):
        return [{
            "channel": "products",
            "fields": { 
                "id": None,
                "permalink": None,
                "date_modified_gmt": None},
            }]

# TODO Channel is not being saved on the channel
class Channel(models.Model):
    """ 
    Represents a channel for example products or blog posts     
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(
        Store, 
        on_delete=CASCADE, 
        related_name='channels',
        verbose_name=_("Store")
        )
    embed_timestamp = models.DateTimeField(null=True, blank=True)
    size = models.IntegerField(_("Size"), default=0)
    channel = models.CharField(max_length=255, null=True, blank=True, choices=CHANNELS)
    is_active = models.BooleanField(default=False)
    fields = JSONField(_("Fields"), help_text=_("Defines which fields will be fetched and included in the vectorstore"), blank=True, null=True, default=list)

    """ def get_all_fields(self):

        
        # Get fields from store type object
        # TODO Add exception handling
        required_fields = [field for field in self.store.store_type.required_fields["channel"][self.channel]["fields"]]
        all_fields = required_fields + self.fields
        
        # Prepare and return final data of selected fields, unselected fields and required fields
        return all_fields """
    
    def get_fields_for_channel(self, optional_fields_list, channel, keys):
        for item in optional_fields_list:
            if item["channel"] == channel:
                return {key: item["fields"][key] for key in keys if key in item["fields"]}
        return {}
    
    def get_fields(self, required_fields, target_channel):
        for item in required_fields:
            if item["channel"] == target_channel:
                return item["fields"]
        return None

    def get_available_fields(self):
        
        # Get fields from store type object
        optional_fields = self.store.store_type.optional_fields()
        optional_fields = self.get_fields_for_channel(optional_fields, self.channel, self.fields)

        required_fields = self.store.store_type.required_fields()
        required_fields = self.get_fields(required_fields, self.channel)

        # Prepare and return final data of selected fields, unselected fields and required fields
        data = {
            "selected": optional_fields,
            "required": required_fields
        }

        return data
            