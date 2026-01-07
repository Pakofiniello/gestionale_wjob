from django.shortcuts import render

def login(request):
    return render(request, 'core/login.html')

def register(request):
    return render(request, 'core/register.html')

def dashboard(request):
    return render(request, 'core/dashboard.html')

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