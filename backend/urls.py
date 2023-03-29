from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.test),#testing
    path('get_details', views.get_details), #1  get all the details of total books, memebers, issued, returned
    path("getBooks", views.get_books), #2  get all the books in inventory
    path("infinite", views.infinte_books),#3  get infinte amount of books
    path("get_book/<int:pk>", views.book_detail), #4  get detail of a particular book
    path('getMembers/', views.create_member), #5  get all the member
    path('member/<int:pk>', views.member_detail), #6  get detail of a particular member
    path('transaction/', views.transactions), #7  get transcation detail of member
    path('search/books', views.search_books_author_isbn), #8  search books authors etc
    path('search/member/<str:pk>', views.search_member),#9  search memebr
    path("issue_books/<int:pk>", views.issue_books),#10
    path("return_book/<int:pk>", views.returning_books),#11
    path('addBook', views.add_quantity)
]