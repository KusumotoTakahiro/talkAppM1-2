# Generated by Django 3.2.23 on 2024-02-11 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatgptHandleAPI', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='prompt_type',
            field=models.CharField(max_length=30, null=True),
        ),
    ]