# Generated by Django 4.1.7 on 2023-02-16 13:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_alter_books_authors_alter_books_publication_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='books',
            name='quantity',
        ),
    ]
