# Generated by Django 4.2.2 on 2023-07-21 07:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("stores", "0002_remove_store_status_store_is_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="store",
            name="openai_key",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
