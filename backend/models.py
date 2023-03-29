from django.db import models

# Create your models here.
class Member(models.Model):
    name = models.CharField(max_length=64)
    phone = models.CharField(max_length=10)
    address = models.CharField(max_length=200, blank=True, null=True)
    age = models.PositiveIntegerField()


class Books(models.Model):
    bookID = models.CharField(primary_key=True, max_length=24)
    title = models.CharField(max_length=1000)
    authors= models.CharField(max_length=1000)
    average_rating= models.CharField(max_length=10)
    isbn= models.CharField(max_length=16)
    isbn13 = models.CharField(max_length=16)
    language_code= models.CharField(max_length=5)
    num_pages = models.CharField(max_length=4,null=True)
    ratings_count = models.CharField(max_length=100)
    text_reviews_count = models.CharField(max_length=100)
    publication_date = models.CharField(max_length=64)
    publisher = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)


class Issue_Book(models.Model):
    member_id = models.ForeignKey(Member, on_delete=models.CASCADE)
    book_id = models.ForeignKey(Books, on_delete=models.CASCADE)
    book_issue_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField( blank=True, null=True)
    returned = models.BooleanField(default=False)
