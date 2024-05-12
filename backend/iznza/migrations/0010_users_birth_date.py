# Generated by Django 4.2.4 on 2023-09-13 13:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('iznza', '0009_users_is_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='birth_date',
            field=models.DateField(auto_now_add=True, db_column='birhday', default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]