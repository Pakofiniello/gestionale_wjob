from django import forms 
from django.contrib.auth.models import User
from . import models

class RegisterForm(forms.Form):
    nome = forms.CharField(max_length=30, label="Nome")
    cognome = forms.CharField(max_length=30, label="Cognome")
    username = forms.CharField(max_length=20, label="Nome utente")
    email = forms.EmailField(label="Email")
    societa = forms.CharField(max_length=100, label="Società", required=False)
    password = forms.CharField(label="Password", widget=forms.PasswordInput)
    confirm_password = forms.CharField(label="Conferma Password", widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', "Le password non corrispondono.")
        
        return cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField(max_length=20, label="Nome utente")
    password = forms.CharField(label = "Password", widget = forms.PasswordInput)


class ProductForm(forms.ModelForm):
    class Meta:
        model = models.Product
        fields = ['name', 'codice_univoco', 'categoria', 'descrizione', 'prezzo', 'prezzo_di_base', 'stock', 'fornitore', 'ordine_riordino', 'unita_in_transito', 'location', 'image', 'is_active']