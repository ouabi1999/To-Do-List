# Generated by Django 4.2.4 on 2023-09-12 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iznza', '0006_alter_users_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='last_login',
            field=models.DateField(auto_now_add=True, verbose_name='Registration Date'),
        ),
    ]
