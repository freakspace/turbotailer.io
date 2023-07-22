import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from django.db.models.fields.json import JSONField

from turbotailer.stores.models import Store, Channel

EMBEDDING_STATUS = (
    ("Pending", _("Pending")),
    ("In progress", _("In progress")),
    ("Complete", _("Complete")),
    ("Failed", _("Failed"))
)


User = get_user_model()


class Content(models.Model):
    """ A product, category etc. """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    channel = models.ForeignKey(
        Channel, 
        on_delete=CASCADE, 
        related_name='content',
        verbose_name=_("Channel")
        )
    store = models.ForeignKey(
        Store, 
        on_delete=CASCADE, 
        related_name='content',
        verbose_name=_("Store")
        )
    identifier = models.CharField(_("Identifier")) # TODO I guess this should be the true identifier from their systems, not SKU / EAN
    updated = models.DateTimeField(_("Last updated"), null=True)


class EmbeddingTask(models.Model):
    """ 
    Record of content embedding 
    Created automatically or manually
    Embedding will run is status 'Pending'
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    channel = models.ForeignKey(
        Channel,
        on_delete=CASCADE, 
        related_name='embedding_tasks',
        verbose_name=_("Channel"))
    tokens_spent = models.IntegerField(default=0)
    status = models.CharField(_("Status"), choices=EMBEDDING_STATUS, default="Pending")
    message = models.CharField(_("Staus Message"), null=True, blank=True)


# TODO Need a task to clean these up as well
class VectorTask(models.Model):
    """ 
    Record of vectorization of a batch
    Usecase is in case they fail, and can be attempted again
    """
    created = models.DateTimeField(auto_now_add=True)
    texts = JSONField(_("Tests"), help_text=_("Texts to store as vectors"), default=list)
    metadatas = JSONField(_("Tests"), help_text=_("Metadatas to store as vectors"), default=list)
    store_id = models.CharField(_("Store ID")) 
    status = models.CharField(_("Status"), choices=EMBEDDING_STATUS, default="Pending")
    batch_size = models.IntegerField()



class EmbeddingTaskAdmin(admin.ModelAdmin):
    # Import here otherwise circular import
    from turbotailer.embeddings.actions import admin_create_batches
    """ Creates vectors in batches """
    actions=[admin_create_batches]
    list_display= ("id", "user", "created", "channel", "tokens_spent", "status")