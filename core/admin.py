from django.contrib import admin
from django.utils.html import format_html
from . import models


@admin.register(models.CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'get_full_name', 'email', 'role', 'societa', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'date_joined', 'societa')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'societa')
    readonly_fields = ('date_joined', 'last_login', 'initials')
    
    fieldsets = (
        ('Informazioni Personali', {
            'fields': ('username', 'first_name', 'last_name', 'email', 'initials')
        }),
        ('Azienda e Ruolo', {
            'fields': ('societa', 'role')
        }),
        ('Permessi', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Date', {
            'fields': ('date_joined', 'last_login'),
            'classes': ('collapse',)
        }),
        ('Password', {
            'fields': ('password',),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ('-date_joined',)


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('nome_categoria', 'get_product_count')
    search_fields = ('nome_categoria', 'descrizione_categoria')
    ordering = ('nome_categoria',)
    
    def get_product_count(self, obj):
        count = obj.product_set.count()
        return format_html(
            '<span style="background-color: #417690; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            count
        )
    get_product_count.short_description = 'Prodotti'


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'codice_univoco', 'categoria', 'get_prezzo_display', 'stock', 'get_stock_status', 'fornitore', 'is_active', 'created_at')
    list_filter = ('is_active', 'categoria', 'fornitore', 'created_at', 'updated_at')
    search_fields = ('name', 'codice_univoco', 'descrizione')
    readonly_fields = ('created_at', 'updated_at', 'get_profit_margin')
    
    fieldsets = (
        ('Informazioni Prodotto', {
            'fields': ('name', 'codice_univoco', 'categoria')
        }),
        ('Prezzi e Costi', {
            'fields': ('prezzo', 'prezzo_di_base', 'get_profit_margin')
        }),
        ('Inventario', {
            'fields': ('stock', 'ordine_riordino', 'unita_in_transito', 'location')
        }),
        ('Venditore e Valutazione', {
            'fields': ('fornitore', 'rating', 'unita_vendute_mensili')
        }),
        ('Descrizione', {
            'fields': ('descrizione', 'image')
        }),
        ('Stato', {
            'fields': ('is_active', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ('-created_at',)
    
    def get_stock_status(self, obj):
        if obj.stock <= 0:
            color = '#d32f2f'  # Rosso
            status = 'Esaurito'
        elif obj.stock < obj.ordine_riordino:
            color = '#f57c00'  # Arancione
            status = 'Basso'
        else:
            color = '#388e3c'  # Verde
            status = 'OK'
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, status
        )
    get_stock_status.short_description = 'Stato Stock'
    
    def get_prezzo_display(self, obj):
        return f'€ {obj.prezzo:.2f}'
    get_prezzo_display.short_description = 'Prezzo'
    
    def get_profit_margin(self, obj):
        if obj.prezzo_di_base and obj.prezzo_di_base > 0:
            margin = ((obj.prezzo - obj.prezzo_di_base) / obj.prezzo_di_base) * 100
            return format_html(
                '<strong>{:.1f}%</strong>',
                margin
            )
        return '-'
    get_profit_margin.short_description = 'Margine di Profitto'


@admin.register(models.Fornitore)
class FornitoreAdmin(admin.ModelAdmin):
    list_display = ('nome', 'partita_iva', 'categoria', 'email', 'get_product_count', 'is_active', 'created_at')
    list_filter = ('is_active', 'categoria', 'created_at', 'updated_at')
    search_fields = ('nome', 'partita_iva', 'email', 'categoria')
    readonly_fields = ('created_at', 'updated_at', 'initials')
    
    fieldsets = (
        ('Informazioni Aziendali', {
            'fields': ('nome', 'partita_iva', 'categoria', 'initials')
        }),
        ('Contatti', {
            'fields': ('email', 'telefono', 'indirizzo')
        }),
        ('Note e Stato', {
            'fields': ('note', 'is_active')
        }),
        ('Date', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ('-created_at',)
    
    def get_product_count(self, obj):
        count = obj.product_set.count()
        return format_html(
            '<span style="background-color: #7b1fa2; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            count
        )
    get_product_count.short_description = 'Prodotti'
