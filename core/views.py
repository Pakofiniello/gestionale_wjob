from django.shortcuts import render
from . import models
from django.http import JsonResponse
import json
from django.contrib.auth import authenticate, login as auth_login, logout
from .forms import LoginForm, RegisterForm 
from django.shortcuts import render,redirect
from django.shortcuts import render, redirect
from django.contrib import messages
from . import forms, models
from django.contrib.auth.decorators import login_required



def product_shop(request):
    products = models.Product.objects.filter(is_active=True)
    categories = models.Category.objects.all()
    
    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category_id=category_id)
    
    context = {
        'products': products,
        'categories': categories,
        'selected_category': category_id,
    }
    return render(request, 'core/shop.html', context)

@login_required
def product_save(request):
    if request.method == 'POST':
        print("=== DEBUG POST DATA ===")
        print(f"POST data: {request.POST}")
        
        form = forms.ProductForm(request.POST)
        
        print(f"Form is valid: {form.is_valid()}")
        
        if form.is_valid():
            product = form.save()
            print(f"Prodotto salvato con ID: {product.id}")
            messages.success(request, f'Prodotto "{product.name}" salvato con successo.')
            return redirect('core:products')
        else:
            print(f"Errori nel form: {form.errors}")
            for field, errors in form.errors.items():
                print(f"Campo '{field}': {errors}")
            messages.error(request, f'Errore nel salvataggio del prodotto: {form.errors}')
            return redirect('core:products')
    
    return redirect('core:products')




@login_required
def logout_view(request):
    logout(request)
    return redirect('core:user_login')

def register(request):


    if request.method == "POST":

        
        form = forms.RegisterForm(request.POST)

        if not form.is_valid():
            print(f"Form errors: {form.errors}")
        
        if form.is_valid():
            
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            nome = form.cleaned_data['nome']
            cognome = form.cleaned_data['cognome']
            societa = form.cleaned_data.get('societa', '')
            

            
            if models.CustomUser.objects.filter(username=username).exists():
                form.add_error('username', 'Nome utente già esistente.')
            elif models.CustomUser.objects.filter(email=email).exists():
                form.add_error('email', 'Email già registrata.')
            else:
                
                user = models.CustomUser.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=nome,
                    last_name=cognome,
                    societa=societa,
                    role='Utente'
                )
                

                messages.success(request, 'Account creato con successo! Effettua il login.')
                
                return redirect('core:user_login')
        else:
            print(" Form NON valido - Ritorno alla pagina di registrazione.")
            
    else:
        form = forms.RegisterForm()
    
    return render(request, 'core/register.html', {'register_form': form})


def user_login(request):
    print("Accesso alla vista di login.")
    if request.method == "POST":
        print("SIamo in post")
        login_form = LoginForm(request.POST)
        print("Dopo il form")
        if login_form.is_valid():
            username = login_form.cleaned_data['username']
            password = login_form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('core:index') 
            else:
                login_form.add_error(None, "Credenziali non valide.")
    else:
        login_form = LoginForm()
        print("Siamo in get")

    context = {
        'login_form': login_form,
        'block_title': "ACCEDI o REGISTRATI",
        'mode': 'login',
    }
    return render(request, "core/login.html", context)

def dashboard(request):

    prodotti = models.Product.objects.all()
    context = {'prodotti': prodotti,
               'n_prodotti': prodotti.count()}


    return render(request, 'core/dashboard.html', context)

def products(request):
    prodotti = models.Product.objects.all()
    categories = models.Category.objects.all()
    fornitori = models.Fornitore.objects.filter(is_active=True)
    context = {'prodotti': prodotti, 'categories': categories, 'fornitori': fornitori}
    return render(request, 'core/products.html', context)

def inventory(request):
    return render(request, 'core/inventory.html')

def orders(request):
    return render(request, 'core/orders.html')

def suppliers(request):
    return render(request, 'core/suppliers.html')

def reports(request):
    return render(request, 'core/reports.html')


def index(request):
    featured_products = models.Product.objects.filter(is_active=True)[:8]
    categories = models.Category.objects.all()
    


    context = {
        'featured_products': featured_products,
        'categories': categories,
        'user': request.user
    }
    return render(request, 'core/index.html', context)

def shop(request):
    """Pagina shop con catalogo prodotti"""
    products = models.Product.objects.filter(is_active=True)
    categories = models.Category.objects.all()
    
    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category_id=category_id)
    
    context = {
        'products': products,
        'categories': categories,
        'selected_category': category_id,
    }
    return render(request, 'core/shop.html', context)

def cart(request):
    cart_data = request.session.get('cart', {})
    cart_items = []
    total_price = 0
    
    for product_id, quantity in cart_data.items():
        try:
            product = models.Product.objects.get(id=int(product_id))
            item_total = float(product.price) * quantity
            total_price += item_total
            cart_items.append({
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'quantity': quantity,
                'image': product.image,
                'item_total': item_total,
            })
        except models.Product.DoesNotExist:
            pass
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
        'cart_count': len(cart_items),
    }
    return render(request, 'core/cart.html', context)

def checkout(request):
    cart_data = request.session.get('cart', {})
    cart_items = []
    total_price = 0
    
    for product_id, quantity in cart_data.items():
        try:
            product = models.Product.objects.get(id=int(product_id))
            item_total = float(product.price) * quantity
            total_price += item_total
            cart_items.append({
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'quantity': quantity,
                'image': product.image,
                'item_total': item_total,
            })
        except models.Product.DoesNotExist:
            pass
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'core/checkout.html', context)

def add_to_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = str(data.get('product_id'))
            quantity = int(data.get('quantity', 1))
            
            cart = request.session.get('cart', {})
            if product_id in cart:
                cart[product_id] += quantity
            else:
                cart[product_id] = quantity
            
            request.session['cart'] = cart
            request.session.modified = True
            
            total_items = sum(cart.values())
            
            return JsonResponse({
                'success': True,
                'message': 'Prodotto aggiunto al carrello',
                'cart_count': total_items,
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Metodo non consentito'}, status=405)

def remove_from_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = str(data.get('product_id'))
            
            cart = request.session.get('cart', {})
            if product_id in cart:
                del cart[product_id]
            
            request.session['cart'] = cart
            request.session.modified = True
            
            total_items = sum(cart.values())
            
            return JsonResponse({
                'success': True,
                'message': 'Prodotto rimosso dal carrello',
                'cart_count': total_items,
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Metodo non consentito'}, status=405)

def update_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = str(data.get('product_id'))
            quantity = int(data.get('quantity', 1))
            
            cart = request.session.get('cart', {})
            if quantity > 0:
                cart[product_id] = quantity
            elif product_id in cart:
                del cart[product_id]
            
            request.session['cart'] = cart
            request.session.modified = True
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Metodo non consentito'}, status=405)