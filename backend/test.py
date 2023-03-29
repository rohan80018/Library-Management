from datetime import datetime, timedelta, date
# d0 = datetime(2023, 2, 15 ,21,1,20 )
# d1 = datetime(2023, 2, 16 ,21,1,19)
# delta = d1 - d0
# print(delta.days)
# print(d1)
# context = {"books":[]}
# l  = [
#     {
#         "bookID": "13688",
#         "title": "Don Quixote",
#         "authors": "Miguel de Cervantes Saavedra/John Rutherford",
#         "average_rating": "3.87",
#         "isbn": "0140449094",
#         "isbn13": "9780140449099",
#         "language_code": "eng",
#         "num_pages": 4,
#         "ratings_count": "335",
#         "text_reviews_count": "52",
#         "publication_date": "1/30/2003",
#         "publisher": "Penguin Books",
#         "quantity": 1
#     },
#     {
#         "bookID": "15655",
#         "title": "The Kindness of Strangers",
#         "authors": "Katrina Kittle",
#         "average_rating": "4.02",
#         "isbn": "0060564784",
#         "isbn13": "9780060564780",
#         "language_code": "en-US",
#         "num_pages": 3,
#         "ratings_count": "11669",
#         "text_reviews_count": "1418",
#         "publication_date": "1/2/2007",
#         "publisher": "William Morrow Paperbacks",
#         "quantity": 1
#     }
# ]
# for i in l:
#     i["bill"] = 20
#     context["books"].append(i)

# print(context)
# today = date.today()
# print(today.year)

import random, json

import urllib.request
request_author = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?authors=john")
data_author = json.loads(request_author.read())

request_books = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?title=harry")
data_books = json.loads(request_books.read())

request_isbn = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?isbn=")
data_isbn = json.loads(request_isbn.read())

d = data_books["message"]+data_author["message"]
# d.append( )
# d.append(data_books["message"][0])

print(d)