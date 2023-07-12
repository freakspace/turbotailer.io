from django.contrib import admin

from .models import Store, WooCommerceStore, Channel

admin.site.register(Store)
admin.site.register(WooCommerceStore)
admin.site.register(Channel)
