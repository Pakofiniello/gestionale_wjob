from django.shortcuts import render
from . import models
def login(request):
    return render(request, 'core/login.html')

def register(request):
    return render(request, 'core/register.html')

def dashboard(request):

    prodotti = models.Product.objects.all()
    context = {'prodotti': prodotti,
               'n_prodotti': prodotti.count()}


    return render(request, 'core/dashboard.html', context)

def products(request):
    return render(request, 'core/products.html')

def inventory(request):
    return render(request, 'core/inventory.html')

def orders(request):
    return render(request, 'core/orders.html')

def suppliers(request):
    return render(request, 'core/suppliers.html')

def reports(request):
    return render(request, 'core/reports.html')