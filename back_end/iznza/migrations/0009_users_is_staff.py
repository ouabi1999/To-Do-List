# Generated by Django 4.2.4 on 2023-09-13 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iznza', '0008_alter_users_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
