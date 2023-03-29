# from django.shortcuts import render
# from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count

from .models import Books, Member, Issue_Book

from .serializer import BookSerializer, MemberSerializer, Issue_BookSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

from datetime import datetime, timedelta, date
import calendar
import random, json, re

import urllib.request
from django.db.models import Q

# Create your views here.
@api_view(["POST"])#testing
def test(request):
  # request_url = urllib.request.urlopen("https://frappe.io/api/method/frappe-library?")
  # print(request_url.read())
  query_text = request.data["data"]
  data=Books.objects.filter(
    Q(title__icontains=query_text) |
    Q(authors__icontains=query_text) |
    Q(isbn__icontains=query_text)
  )
  con = {"d":[]}
  for i in data.values():
      con["d"].append(i)
  # print(con)
  return Response(con)


@api_view(["GET"])#1
def get_details(request):
  books = Books.objects.all().count()
  members = Member.objects.all().count()
  issued = Issue_Book.objects.filter(returned=False).count()
  returned = Issue_Book.objects.filter(returned = True).count()
  return Response({
    "books": books,
    "members": members,
    "issued_books":issued,
    "returned_books": returned
  })


def add_books(data):#funciton to add books
  for i in data["message"]:
    try:
      update = Books.objects.get(bookID=i["bookID"])
      if "quantity" in i.keys():
        update.quantity += int(i["quantity"])
      else:
        update.quantity +=1  
      update.save()
    except ObjectDoesNotExist:
      pass
      serializer = BookSerializer(data=i)
      serializer.is_valid(raise_exception=True)
      serializer.save()
  return f"Book Added"


@api_view(["POST"])
def add_quantity(request):
  post_data = request.data
  quantity = int(post_data["message"]["quantity"]) 
  if quantity > 0 and quantity <=30:
    print("ok")
    data = {"message":[]}
    data["message"].append(post_data["message"])
    add_books(data)
    data = Books.objects.all()
    serial = BookSerializer(data,many=True)
    return Response(serial.data,status=201)
  return Response("ok")


@api_view(["POST"])
def infinte_books(requset): #3
  post_data = requset.data
  page = post_data["page"]
  if post_data["type"] == "random":
    request_url = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?page={page}")
    data = json.loads(request_url.read())
    if add_books(data) == "Book Added":
      data = Books.objects.all()
      serializer = BookSerializer(data, many=True)
      return Response(serializer.data, status=201)
  elif post_data["type"] == "cart":
    data=Books.objects.filter(bookID__in=page)
    serial = BookSerializer(data, many=True)
    return Response(serial.data)

  request_url = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?page={page}")
  p = request_url.read()
  data = json.loads(p)
  serial = BookSerializer(data["message"], many= True)
  return Response(serial.data)


@api_view(["GET","POST"])#2
def get_books(request):
  if request.method == "POST":
    if request.data["type"] == "random_books":
      page = random.randint(1, 200)
      request_url = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?page={page}")
      data_json = json.loads(request_url.read())
      add_books(data_json)
    elif request.data["type"] == "specific-books":
      book_ids = request.data
      data = Books.objects.filter(bookID__in=book_ids)
      serial = BookSerializer(data, many=True)
      return Response(serial.data)
    
    data = Books.objects.all()
    serial = BookSerializer(data, many=True)
    return Response(serial.data)
  
  book_data = Books.objects.all()
  serial = BookSerializer(book_data, many=True)
  return Response(serial.data)


@api_view(["GET","PUT","DELETE"])#4
def book_detail(request,pk):
  book = Books.objects.get(bookID=pk)
  if request.method == "PUT":
    put_data = request.data
    book.quantity = int(put_data["quantity"])
    book.save()
  serial = BookSerializer(book)
  return Response(serial.data, status=201)


@api_view(["POST","GET"])#5
def create_member(request):
  if request.method == "POST":
    post_member= request.data
    print(post_member)
    if int(post_member["age"]) >100 or int(post_member['age']) <8:
      return Response({"message":"Age should be within 8 - 100"}, status=400)
    if len(post_member["phone"]) != 10:
      return Response({"message":"Phone number must be 10 digit"}, status=400)
    if not re.search("^[6-9]",post_member["phone"]):
      return Response({"message":"Phone number must start with 6-9"}, status=400)
    if not re.search("^\\d+$",post_member["phone"]):
      return Response({"message":"Phone number contains only number"}, status=400)
    mem = Member.objects.filter(phone=post_member["phone"])
    if mem:
      return Response({"message":"Phone number already exists"}, status=400)
    serializer = MemberSerializer(data=post_member)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    data = Member.objects.all()
    serial = MemberSerializer(data, many=True)
    return Response({"data":serial.data,"message":"Member Added"}, status=201)

  data = Member.objects.all()
  serial = MemberSerializer(data, many=True)
  return Response(serial.data)


@api_view(["GET","PUT","DELETE"])#6
def member_detail(request,pk):
  today = date.today()
  tommorow = today + timedelta(1)
  member = Member.objects.get(id=pk)
  books = member.issue_book_set.all()
  if request.method == "PUT":
    put_data = request.data
    # print(put_data)
    phone = put_data["phone"]
    print(type(phone))
    if int(put_data["age"]) >100 or int(put_data['age']) <8:
      return Response({"message":"Age should be within 8 - 100"}, status=400)
    if len(phone) != 10:
      return Response({"message":"Phone number must be 10 digit"}, status=400)
    if not re.search("^[6-9]",phone):
      return Response({"message":"Phone number must start with 6-9"}, status=400)
    if not re.search("^\\d+$",phone):
      return Response({"message":"Phone number contains only number"}, status=400)
    serializer = MemberSerializer(member, data=put_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    member_serial = MemberSerializer(member)
    return Response({"member":member_serial.data,"message":"Profile Updated"},status=201)

  elif request.method == "DELETE":
    member.delete()
    return Response("Member Deleted",status=200)

  booksChart = books.filter(book_issue_date__range=(date(today.year,1,1),tommorow))
  book_serial = Issue_BookSerializer(books, many=True)
  member_serial = MemberSerializer(member)
  returned_books_count = books.filter(returned=True).aggregate(Count('returned'))
  
  trans_data = Issue_Book.objects.filter(member_id=pk).select_related("book_id", "member_id").order_by("-book_issue_date")
  context= {
    "member":member_serial.data,
    "books":book_serial.data,
    "books_issued":books.count(),
    "books_issued_current":books.count()-returned_books_count["returned__count"],
    "books_returned": returned_books_count["returned__count"],
    "chart":{
      "mon":[],
      "issue":[],
      "returned":[]
      },
    "trans":[],
    "total_outstanding":0,
    "total_paid":0,
    "err" : False
    }
  if not trans_data:
    context["err"] = True
  for i, j in enumerate(trans_data.values()):
    issue_date = trans_data[i].book_issue_date 
    if trans_data[i].returned:
      paid = (trans_data[i].return_date - issue_date).days *10
      context["total_paid"]+=paid
      j["paid_balance"] = paid
    else:
      outstanding = (datetime.now() - issue_date).days*10
      context["total_outstanding"]+=outstanding
      j["outstanding_balance"] = outstanding
    j["title"] = trans_data[i].book_id.title
    j["name"] = trans_data[i].member_id.name
    context["trans"].append(j)

  for i in booksChart:
    month_name = calendar.month_name[i.book_issue_date.month]
    
    if month_name not in context["chart"]["mon"]:
      context["chart"]["mon"].append(month_name)
      context["chart"]["issue"].append(1)
      context["chart"]["returned"].append(0)
    else:
      index = context["chart"]["mon"].index(month_name)
      context["chart"]["issue"][index] +=1
    if i.returned:
      return_month = calendar.month_name[i.return_date.month]
      if return_month not in context["chart"]["mon"]:
        context["chart"]["mon"].append(return_month)
        context["chart"]["returned"].append(1)
        context["chart"]["issue"].append(0)
      else:
        index = context["chart"]["mon"].index(return_month)
        context["chart"]["returned"][index] +=1
  return Response(context)


@api_view(["GET"]) #9
def search_member(request,pk):
  m = Member.objects.filter(
    Q(name__icontains=pk)|
    Q(phone__contains=pk)|
    Q(address__icontains=pk)
  )
  if not m:
    return Response({"message":"No Record Found"},status=204)
  serial = MemberSerializer(m, many=True)
  return Response(serial.data,status = 200)

@api_view(["POST"])#8
def search_books_author_isbn(request):
  data = request.data
  page = data["page"]
  query= data["query"]
  
  query_data = query.replace(" ","%20")
  print(query_data)
  if data["type"] == "local":
    book_data = Books.objects.filter(
      Q(title__icontains=query) |
      Q(authors__istartswith=query) |
      Q(publisher__istartswith=query) |
      Q(isbn__exact=query) |
      Q(isbn13__exact=query)
    )
    if not book_data:
      return Response({"message":"No Data Found"}, status=204)
    serial = BookSerializer(book_data, many=True)
    return Response(serial.data, status=200)
  elif data["type"] == "online":
    request_author = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?authors={query_data}&page={page}")
    data_author = json.loads(request_author.read())

    request_books = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?title={query_data}&page={page}")
    data_books = json.loads(request_books.read())

    request_publisher = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?publisher={query_data}&page={page}")
    data_publisher = json.loads(request_publisher.read())

    request_isbn = urllib.request.urlopen(f"https://frappe.io/api/method/frappe-library?isbn={query_data}&page={page}")
    data_isbn = json.loads(request_isbn.read())
    
    search_data = data_books["message"] + data_author["message"] + data_publisher["message"] +data_isbn["message"]
    serial = BookSerializer(search_data, many=True)
    return Response(serial.data , status=200)


@api_view(["POST"])#10
def issue_books(request,pk):
  data = request.data
  member_data = Member.objects.get(id=pk)
  out_books = Issue_Book.objects.filter(member_id=pk,returned=False)
  today = date.today()
  #if 5 books already issued then error
  if out_books.count() < 5:
    outstanding_amount = 0
    #if outstanding amountmore than 500 then err
    for i in out_books:
      #if book already issued then err
      if i.book_id.bookID in data["books"]:
        z = Books.objects.get(bookID=i.book_id.bookID)
        return Response({"message": f"'{z.title}' book already issued"}, status=409)
      issue_date = i.book_issue_date
      delta = datetime.now() - issue_date
      outstanding_amount += (delta.days)*10
      if outstanding_amount >= 500:
        return Response({"message":"Outstanding limit exceededed"}, status=429)
  else:
    return Response({"message": "Book issue limit exceeded"}, status=429)
  
  #issuing books and deducting quantity from Books
  for i in data["books"]:
    book = Books.objects.get(bookID=i)
    issue_book = Issue_Book(member_id=member_data, book_id=book, book_issue_date=datetime(today.year,today.month,today.day,00,00,00,00))
    issue_book.save()
    book.quantity -= 1
    book.save()
  return Response({"message":"Issue Succesfull"},status=201)


@api_view(["GET","POST"])#11
def returning_books(request, pk):
  return_book = Issue_Book.objects.filter(member_id = pk , returned = False, book_issue_date__lt=datetime.today()).select_related("book_id")
  context = {"books":[], "message":""}

  if request.method == "POST":
    post_data = request.data["books"]
    return_book = Issue_Book.objects.filter(member_id=pk, returned=False, book_id__in=post_data)
    for i in return_book:
      data = Books.objects.get(bookID=i.book_id.bookID)
      data.quantity+=1
      data.save()
      i.return_date = datetime.now()
      i.returned = True
      i.save()
    return Response({"message":"Books Returned"},status=201)

  if not return_book:
    context["message"] = "No Book Issued"
  else:
    for i in return_book:
      book_data = Books.objects.get(bookID=i.book_id.bookID)
      serial = BookSerializer(book_data)
      context["books"].append(serial.data)
  return Response(context)


@api_view(["GET"])#9
def transactions(request):
  data = Issue_Book.objects.all().select_related("book_id", "member_id").order_by("-book_issue_date")
  context={"trans" : [],"total_outstanding":0,"total_paid":0, "err":False}

  for i , j in zip((data), (data.values())):
    issue_date = j["book_issue_date"] 
    if j["returned"]:
      paid = (j["return_date"]-issue_date).days *10
      context["total_paid"]+=paid
      j["paid_balance"] = paid
    else:
      outstanding = (datetime.now() - issue_date).days*10
      context["total_outstanding"]+=outstanding
      j["outstanding_balance"] = outstanding
        
    j["title"] = i.book_id.title
    j["name"] = i.member_id.name

    context["trans"].append(j)
  return Response(context)

