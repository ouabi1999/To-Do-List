# Generated by Django 4.2.4 on 2023-09-12 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iznza', '0005_alter_users_email_alter_users_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='email',
            field=models.EmailField(max_length=240, unique=True),
        ),
    ]