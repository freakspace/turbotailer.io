from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from turbotailer.users.api.views import UserViewSet
from turbotailer.embeddings.api.views import EmbeddingsViewSet
from turbotailer.stores.api.views import StoresViewSet
from turbotailer.prompts.api.views import PromptsViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("embeddings", EmbeddingsViewSet, basename="embeddings")
router.register("stores", StoresViewSet, basename="stores")
router.register("prompts", PromptsViewSet, basename="prompts")

app_name = "api"
urlpatterns = router.urls


