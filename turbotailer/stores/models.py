
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

    def get_available_fields(self):

        fields_optional = {
                "WooCommerceStore" : {
                    "products": [
                        "name", 
                        "description", 
                        "short_description",
                        "sku",
                        "price",
                        "regular_price",
                        "on_sale",
                        "categories",
                        "images",
                        "attributes"
                        ],
                    "categories": [],
                    "orders": []
                }
            }
        
        fields_required = {
                "WooCommerceStore" : {
                    "products": ["id", "permalink", "date_modified_gmt"],
                    "categories": [],
                    "orders": []
                }
            }

        # Get the name of model i.e. 'WooCommerceStore'
        store_type_name = self.store.store_type.__class__.__name__
        
        # Get all optional fields related to a channel i.e. 'products'
        all_fields = fields_optional[store_type_name][self.channel]

        # Prepare and return final data of selected fields, unselected fields and required fields
        data = {
            "selected": self.fields,
            "unselected": [field for field in all_fields if field not in self.fields],
            "required": fields_required[store_type_name][self.channel]
        }

        return data
            