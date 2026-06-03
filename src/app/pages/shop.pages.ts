import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, NavController, ModalController, AlertController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-filter-modal',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--padding-top: 16px;">
        <ion-title style="font-weight: 800; color: #114232;">Filter & Urutkan</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="reset()" color="secondary" style="font-weight: 700; font-size: 14px;">Atur Ulang</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="filter-section">
        <h4 class="section-title">Urutkan Berdasarkan</h4>
        <ion-radio-group [(ngModel)]="localFilters.sort_by">
          <ion-item lines="none" class="filter-radio-item">
            <ion-label>Terbaru</ion-label>
            <ion-radio slot="end" value="latest"></ion-radio>
          </ion-item>
          <ion-item lines="none" class="filter-radio-item">
            <ion-label>Harga: Termurah</ion-label>
            <ion-radio slot="end" value="cheapest"></ion-radio>
          </ion-item>
          <ion-item lines="none" class="filter-radio-item">
            <ion-label>Harga: Termahal</ion-label>
            <ion-radio slot="end" value="expensive"></ion-radio>
          </ion-item>
        </ion-radio-group>
      </div>

      <div class="filter-section" style="margin-top: 24px;">
        <h4 class="section-title">Rentang Harga (Rp)</h4>
        <div class="price-input-row">
          <div class="price-field">
            <span>Min</span>
            <input type="number" placeholder="0" [(ngModel)]="localFilters.min_price">
          </div>
          <div class="price-dash"></div>
          <div class="price-field">
            <span>Max</span>
            <input type="number" placeholder="Tanpa batas" [(ngModel)]="localFilters.max_price">
          </div>
        </div>
      </div>

      <div style="height: 40px;"></div>
      <ion-button expand="block" class="zeven-gradient-btn" (click)="apply()">Tampilkan Produk</ion-button>
    </ion-content>
  `,
  styles: [`
    .section-title { font-size: 15px; font-weight: 700; color: #333; margin-bottom: 16px; margin-top: 0; }
    .filter-radio-item { --padding-start: 0; --inner-padding-end: 0; margin-bottom: 4px; font-size: 14px; }
    .filter-radio-item ion-radio { --color-checked: #C68E17; }
    
    .price-input-row { display: flex; align-items: center; gap: 12px; }
    .price-field { flex: 1; background: #f9f9f9; border-radius: 12px; padding: 10px 14px; border: 1px solid #eee; }
    .price-field span { font-size: 10px; color: #999; display: block; margin-bottom: 2px; }
    .price-field input { border: none; background: transparent; width: 100%; outline: none; font-size: 14px; font-weight: 600; color: #333; }
    .price-dash { width: 10px; height: 1.5px; background: #ddd; }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilterModalComponent implements OnInit {
  @Input() filters: any;
  localFilters: any = {
    min_price: null,
    max_price: null,
    sort_by: 'latest'
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.filters) {
      this.localFilters = { ...this.filters };
    }
  }

  reset() {
    this.localFilters = {
      min_price: null,
      max_price: null,
      sort_by: 'latest'
    };
  }

  apply() {
    this.modalCtrl.dismiss(this.localFilters);
  }
}

@Component({
  selector: 'app-home',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #114232; --padding-top: 4px; --padding-bottom: 4px;">
        <div class="header-row">
          <div class="logo-small">
            <span class="z">Z</span><span class="seven">7</span>
          </div>
          
          <div class="search-bar">
            <ion-icon name="search-outline"></ion-icon>
            <input type="text" placeholder="Cari barang impian..." [(ngModel)]="searchQuery" (input)="onSearch()">
            <ion-button fill="clear" (click)="openFilter()" class="filter-mini-btn">
              <ion-icon name="options-outline" [color]="isFilterActive() ? 'secondary' : 'medium'"></ion-icon>
            </ion-button>
          </div>
          
          <div class="header-actions" style="display: flex; gap: 4px;">
            <ion-button (click)="goToCart()" fill="clear" class="header-icon-btn" style="position: relative;">
              <ion-icon name="cart-outline" style="color: #ffffff; font-size: 24px;"></ion-icon>
              <ion-badge *ngIf="cartCount > 0" color="danger" class="badge-overlay">{{ cartCount }}</ion-badge>
            </ion-button>
            <ion-button (click)="goToChatList()" fill="clear" class="header-icon-btn" style="position: relative;">
              <ion-icon name="chatbubble-ellipses-outline" style="color: #ffffff; font-size: 24px;"></ion-icon>
              <ion-badge *ngIf="unreadChatCount > 0" color="danger" class="badge-overlay">{{ unreadChatCount }}</ion-badge>
            </ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content pullingText="Tarik untuk memuat ulang..." refreshingSpinner="crescent"></ion-refresher-content>
      </ion-refresher>

      <div class="ion-padding-horizontal">
        <!-- Discovery Section (Only show when not searching) -->
        <ng-container *ngIf="!searchQuery">
          <ion-grid class="ion-no-padding">
            <ion-row style="margin-bottom: 24px;">
              <ion-col size="3" (click)="selectCategory('')" class="category-col">
                <div class="category-item" [class.active-cat]="!selectedCategory">
                  <div class="icon-wrapper">
                    <ion-icon name="apps-outline"></ion-icon>
                  </div>
                  <span>Semua</span>
                </div>
              </ion-col>
              <ion-col size="3" *ngFor="let cat of categories" (click)="selectCategory(cat.name)" class="category-col">
                <div class="category-item" [class.active-cat]="selectedCategory === cat.name">
                  <div class="icon-wrapper">
                    <ion-icon [name]="cat.icon"></ion-icon>
                  </div>
                  <span>{{ cat.name }}</span>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <div class="section-header">
            <h2>Produk Terbaru</h2>
          </div>
        </ng-container>

        <!-- Search Header (Only show when searching) -->
        <div class="section-header" *ngIf="searchQuery">
          <h2>Hasil Pencarian untuk "{{ searchQuery }}"</h2>
          <ion-button fill="clear" size="small" color="secondary" (click)="searchQuery = ''; onSearch()">Batal</ion-button>
        </div>

        <div *ngIf="isLoading" class="ion-text-center ion-padding">
           <ion-spinner name="crescent" color="primary"></ion-spinner>
        </div>

        <ion-grid class="ion-no-padding" *ngIf="!isLoading">
          <ion-row>
            <ion-col size="6" *ngFor="let product of products; trackBy: trackById" class="ion-padding-tiny">
              <div class="zeven-product-card" (click)="goToDetail(product.id)">
                <div class="img-container">
                  <img [src]="productService.storageUrl + product.image" 
                       onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300'">
                  <div class="wishlist-btn"><ion-icon name="heart-outline"></ion-icon></div>
                </div>
                <div class="info">
                  <h4 class="title">{{ product.name }}</h4>
                  <div class="price">Rp{{ Number(product.price).toLocaleString('id-ID') }}</div>
                  <div class="meta">
                    <div class="rating">
                      <ion-icon name="star"></ion-icon> 
                      {{ product.average_rating ? Number(product.average_rating).toFixed(1) : '0.0' }}
                    </div>
                    <div class="sold">Terjual {{ product.sold_count || '0' }}+</div>
                  </div>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div *ngIf="!isLoading && products.length === 0" class="empty-state">
           <ion-icon name="search-outline"></ion-icon>
           <p>Produk tidak ditemukan.</p>
        </div>
      </div>
      <div style="height: 100px;"></div>
    </ion-content>
  `,
  styles: [`
    .logo-small { 
      font-size: 24px; 
      font-weight: 800; 
      display: flex;
      align-items: center;
    }
    .header-row {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 8px;
      width: 100% !important;
      padding: 0 8px;
    }
    .z { color: #ffffff; }
    .seven { color: var(--ion-color-secondary); }
    
    .search-bar { 
      flex: 1 !important; 
      min-width: 0 !important; 
      background: #fff; 
      border-radius: 12px; 
      padding: 4px 10px; 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      border: 1px solid #eee; 
      height: 36px;
    }
    .filter-mini-btn {
      --padding-start: 4px; --padding-end: 4px;
      margin: 0;
      height: 30px;
    }
    .filter-mini-btn ion-icon { font-size: 18px; }
    .search-bar input { 
      border: none; 
      outline: none; 
      flex: 1; 
      font-size: 13px; 
      background: transparent;
      width: 100%;
    }
    .header-actions { 
      display: flex; 
      gap: 0; 
      flex-shrink: 0;
    }
    .header-icon-btn { 
      --padding-start: 4px; 
      --padding-end: 4px; 
      margin: 0; 
      height: 38px;
    }
    .badge-overlay { 
      position: absolute; 
      top: -2px; 
      right: -2px; 
      min-width: 16px; 
      height: 16px; 
      border-radius: 50%; 
      padding: 0; 
      font-size: 9px; 
      font-weight: 700; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      border: 1.5px solid white; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
      z-index: 10; 
    }
    
    .promo-container { padding: 16px; }
    .promo-banner { background: linear-gradient(135deg, #114232 0%, #295546 100%); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; }
    .banner-text { position: relative; z-index: 2; }
    .banner-text h3 { margin: 0; font-size: 14px; opacity: 0.8; font-weight: 400; }
    .banner-text h2 { margin: 8px 0; font-size: 26px; font-weight: 800; color: var(--ion-color-secondary); }
    .banner-text p { margin: 0 0 16px; font-size: 12px; opacity: 0.7; max-width: 70%; }
    .shop-now-btn { --background: #C68E17; --border-radius: 10px; font-weight: 700; --color: white; }
    .banner-circle { position: absolute; right: -40px; top: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.05); border-radius: 50%; z-index: 1; }

    .category-col { padding: 4px; }
    .category-item { display: flex; flex-direction: column; align-items: center; gap: 8px; transition: 0.3s; }
    .icon-wrapper { width: 56px; height: 56px; border-radius: 18px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #114232; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1.5px solid transparent; transition: 0.3s; }
    .category-item span { font-size: 11px; font-weight: 600; color: #666; text-align: center; }
    .active-cat .icon-wrapper { background: #114232; color: white; transform: translateY(-5px); box-shadow: 0 8px 15px rgba(17,66,50,0.2); }
    .active-cat span { color: #114232; font-weight: 800; }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 12px; }
    .section-header h2 { margin: 0; font-size: 18px; font-weight: 800; color: #114232; }

    .ion-padding-tiny { padding: 6px; }
    .zeven-product-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); height: 100%; border: 1px solid #f9f9f9; display: flex; flex-direction: column; }
    .img-container { position: relative; width: 100%; padding-bottom: 100%; flex-shrink: 0; overflow: hidden; background: #f4f5f8; }
    .img-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
    .wishlist-btn { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #eb445a; font-size: 16px; z-index: 10; }
    .info { padding: 12px; display: flex; flex-direction: column; flex: 1; }
    .title { margin: 0 0 6px; font-size: 13px; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .price { font-size: 16px; font-weight: 800; color: #C68E17; margin-top: auto; }
    .meta { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 11px; color: #92949c; }
    .rating { display: flex; align-items: center; gap: 2px; color: #ffc409; font-weight: 700; }
    
    .empty-state { padding: 40px; text-align: center; color: #92949c; }
    .empty-state ion-icon { font-size: 48px; opacity: 0.3; margin-bottom: 12px; }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';
  min_price: number | null = null;
  max_price: number | null = null;
  sort_by: string = 'latest';
  isLoading: boolean = false;
  cartCount: number = 0;
  unreadChatCount: number = 0;
  private chatPollingTimer: any;
  Number = Number;
  trackById(index: number, item: any) { return item?.id || index; }

  constructor(
    private router: Router,
    public productService: ProductService,
    private cartService: CartService,
    private chatService: ChatService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.fetchCategories();
    this.fetchProducts();
    this.startChatPolling();
    this.fetchCartCount();
  }

  fetchCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Gagal ambil kategori', err)
    });
  }

  ionViewWillEnter() {
    this.cartService.updateCartCount();
  }

  ngOnDestroy() {
    if (this.chatPollingTimer) clearInterval(this.chatPollingTimer);
  }

  startChatPolling() {
    this.fetchUnreadCount();
    this.chatPollingTimer = setInterval(() => this.fetchUnreadCount(), 10000);
  }

  fetchUnreadCount() {
    this.chatService.getChatList().subscribe({
      next: (chats: any[]) => {
        this.unreadChatCount = chats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
      }
    });
  }

  fetchCartCount() {
    this.cartService.cartCount$.subscribe(count => this.cartCount = count);
  }

  doRefresh(event: any) {
    this.fetchProducts();
    this.fetchUnreadCount();
    this.fetchCartCount();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  fetchProducts() {
    this.isLoading = true;
    const params = {
      search: this.searchQuery,
      category: this.selectedCategory,
      min_price: this.min_price || undefined,
      max_price: this.max_price || undefined,
      sort_by: this.sort_by
    };

    this.productService.getProducts(params).subscribe({
      next: (res) => { this.products = res.data || []; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  isFilterActive(): boolean {
    return !!(this.min_price || this.max_price || this.sort_by !== 'latest');
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        filters: {
          min_price: this.min_price,
          max_price: this.max_price,
          sort_by: this.sort_by
        }
      },
      breakpoints: [0, 0.5, 0.7],
      initialBreakpoint: 0.5,
      handle: true,
      cssClass: 'zeven-filter-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.min_price = data.min_price;
      this.max_price = data.max_price;
      this.sort_by = data.sort_by;
      this.fetchProducts();
    }
  }

  selectCategory(name: string) {
    this.selectedCategory = name;
    this.fetchProducts();
  }

  onSearch() { this.fetchProducts(); }
  goToDetail(id: number) { this.router.navigate(['/product-detail', id]); }
  goToCart() { this.router.navigate(['/cart']); }
  goToChatList() { this.router.navigate(['/tabs/chat-list']); }
}

@Component({
  selector: 'app-product-detail',
  template: `
    <ion-header class="ion-no-border header-floating">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-button (click)="goBack()" class="glass-btn">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button (click)="toggleFavorite()" class="glass-btn" [class.active-heart]="isFavorite">
            <ion-icon [name]="isFavorite ? 'heart' : 'heart-outline'"></ion-icon>
          </ion-button>
          <ion-button (click)="goToCart()" class="glass-btn">
            <ion-icon name="cart-outline"></ion-icon>
            <ion-badge *ngIf="cartCount > 0" color="danger" class="badge-mini">{{ cartCount }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg" [fullscreen]="true" scrollEvents="true">
      <div *ngIf="isLoading" class="loader-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <div *ngIf="!isLoading && product" class="fade-in">
        <!-- Hero Image / Slider -->
        <div class="hero-image-wrapper">
          <div class="image-counter" *ngIf="product.images?.length > 1">
            {{ activeSlideIndex + 1 }}/{{ product.images.length }}
          </div>
          <swiper-container #swiper pagination="true" zoom="true" *ngIf="product.images?.length > 0">
            <swiper-slide *ngFor="let img of product.images; trackBy: trackById">
              <img [src]="img.image_url" 
                   onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'">
            </swiper-slide>
          </swiper-container>
          <img *ngIf="!product.images || product.images.length === 0" 
               [src]="productService.storageUrl + product.image" 
               onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'">
        </div>

        <div class="content-sheet">
          <div class="sheet-main">
            <!-- Price and Rating -->
            <div class="price-section">
              <div class="price-value">Rp{{ Number(product.price).toLocaleString('id-ID') }}</div>
              <div class="rating-tag" (click)="scrollToReviews()">
                <ion-icon name="star"></ion-icon>
                <span>{{ reviewStats.average > 0 ? reviewStats.average : '0.0' }}</span>
              </div>
            </div>
            
            <h1 class="product-name-heading">{{ product.name }}</h1>
            
            <div class="meta-info">
              <span class="sold-count">Terjual {{ product.sold_count || '0' }}+</span>
              <div class="dot-divider"></div>
              <span class="review-count-meta" (click)="scrollToReviews()">{{ reviewStats.total }} Ulasan</span>
              <div class="dot-divider"></div>
              <span class="stock-status" [class.low-stock]="product.stock < 10">Stok: {{ product.stock }}</span>
            </div>

            <div class="divider-line"></div>

            <!-- Seller Card -->
            <div class="seller-card-premium">
              <div class="avatar-glow">
                <div class="avatar-img">{{ product.seller?.name?.charAt(0) || 'S' }}</div>
              </div>
              <div class="seller-info-text">
                <h4 class="seller-name-label">{{ product.seller?.name || 'Zeven Premium Store' }}</h4>
                <!-- <div class="seller-status"><span class="status-indicator"></span> Online Baru saja</div> -->
              </div>
            </div>

            <div class="section-container">
              <h3 class="section-label">Deskripsi Produk</h3>
              <p class="desc-text-premium">{{ product.description }}</p>
            </div>

            <!-- Quantity Selector -->
            <div class="section-container">
               <h3 class="section-label">Pilih Jumlah</h3>
               <div class="qty-control-premium">
                  <button (click)="decreaseQty()" [disabled]="quantity <= 1">
                    <ion-icon name="remove"></ion-icon>
                  </button>
                  <span class="qty-number">{{ quantity }}</span>
                  <button (click)="increaseQty()" [disabled]="quantity >= (product?.stock || 99)">
                    <ion-icon name="add"></ion-icon>
                  </button>
               </div>
            </div>

            <!-- ===== REVIEW SECTION ===== -->
            <div class="section-container review-section" id="review-section">
              <div class="review-header-row">
                <h3 class="section-label" style="margin-bottom:0">Ulasan Pembeli</h3>
                <span class="review-count-badge">{{ reviewStats.total }} ulasan</span>
              </div>

              <!-- Rating Summary -->
              <div class="rating-summary-card" *ngIf="reviewStats.total > 0">
                <div class="rating-big">
                  <span class="rating-number">{{ reviewStats.average }}</span>
                  <div>
                    <div class="stars-row">
                      <ion-icon *ngFor="let s of [1,2,3,4,5]" 
                        [name]="reviewStats.average >= s ? 'star' : (reviewStats.average >= s-0.5 ? 'star-half' : 'star-outline')"
                        class="star-icon filled"></ion-icon>
                    </div>
                    <span class="rating-label">dari 5.0</span>
                  </div>
                </div>
                <div class="rating-bars">
                  <div class="bar-row" *ngFor="let b of ratingBars; trackBy: trackById">
                    <span class="bar-label">{{ b.star }}★</span>
                    <div class="bar-track"><div class="bar-fill" [style.width.%]="b.pct"></div></div>
                    <span class="bar-count">{{ b.count }}</span>
                  </div>
                </div>
              </div>

              <!-- Empty Reviews -->
              <div class="empty-review" *ngIf="reviewStats.total === 0 && !isLoadingReviews">
                <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                <p>Belum ada ulasan untuk produk ini.</p>
                <span>Jadilah yang pertama memberi ulasan!</span>
              </div>

              <!-- Loading -->
              <div *ngIf="isLoadingReviews" class="ion-text-center ion-padding">
                <ion-spinner name="crescent" color="primary"></ion-spinner>
              </div>

              <!-- Review List -->
              <div class="review-list" *ngIf="!isLoadingReviews">
                <div class="review-card" *ngFor="let rv of reviews.slice(0, showAllReviews ? 999 : 3); trackBy: trackById">
                  <div class="rv-header">
                    <div class="rv-avatar">{{ rv.buyer?.name?.charAt(0) || 'P' }}</div>
                    <div class="rv-meta">
                      <span class="rv-name">{{ rv.buyer?.name || 'Pembeli' }}</span>
                      <div class="rv-stars">
                        <ion-icon *ngFor="let s of [1,2,3,4,5]" 
                          [name]="rv.rating >= s ? 'star' : 'star-outline'" 
                          class="star-icon" [class.filled]="rv.rating >= s"></ion-icon>
                      </div>
                    </div>
                    <span class="rv-date">{{ formatDate(rv.created_at) }}</span>
                  </div>
                  <p class="rv-text">{{ rv.review }}</p>
                  
                  <!-- Seller Reply -->
                  <div class="seller-reply-card" *ngIf="rv.reply">
                    <div class="reply-header">
                      <div class="line"></div>
                      <span>Balasan Penjual</span>
                    </div>
                    <p class="reply-text">{{ rv.reply }}</p>
                  </div>
                </div>

                <div class="show-more-btn" *ngIf="reviews.length > 3 && !showAllReviews" (click)="showAllReviews = true">
                  Lihat semua {{ reviews.length }} ulasan
                  <ion-icon name="chevron-down-outline"></ion-icon>
                </div>
              </div>
            </div>
            <!-- ===== END REVIEW SECTION ===== -->
          </div>
        </div>
      </div>
      <div style="height: 120px;"></div>
    </ion-content>

    <ion-footer class="ion-no-border footer-premium" *ngIf="product">
      <div class="action-bar-premium">
        <!-- Chat Icon -->
        <div class="icon-action-btn" (click)="goToChat()">
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
          <span>Chat</span>
        </div>

        <!-- Add to Cart Icon with Badge -->
        <div class="icon-action-btn cart-btn-wrap" (click)="addToCart()">
          <ion-icon name="cart-outline"></ion-icon>
          <span>Keranjang</span>
          <div class="badge-dot" *ngIf="cartCount > 0"></div>
        </div>

        <!-- Main Buy Button -->
        <ion-button class="buy-now-btn-premium" (click)="buyNow()" [disabled]="isAdding">
          {{ isAdding ? 'Memproses...' : 'Beli Sekarang' }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .header-floating { position: absolute; top: 0; width: 100%; z-index: 100; }
    .glass-btn { 
      --background: rgba(255,255,255,0.7); 
      --color: #114232; 
      --border-radius: 50%; 
      width: 40px; height: 40px; 
      margin: 8px; 
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      --padding-start: 0; --padding-end: 0;
    }
    .active-heart { --color: #eb445a; }
    .badge-mini { position: absolute; top: 2px; right: 2px; min-width: 14px; height: 14px; font-size: 8px; border-radius: 50%; padding: 0; border: 1.5px solid white; display: flex; align-items:center; justify-content: center; }

    .loader-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
    .fade-in { animation: fadeIn 0.4s ease-out; }

    .hero-image-wrapper { width: 100%; height: 420px; background: #fff; overflow: hidden; position: relative; }
    .hero-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    swiper-container { width: 100%; height: 100%; display: block; --swiper-pagination-color: #114232; }
    swiper-slide { width: 100%; height: 100%; display: block; }
    
    .image-counter {
      position: absolute;
      bottom: 45px;
      right: 15px;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      z-index: 101;
      backdrop-filter: blur(8px);
    }

    .content-sheet { 
      background: var(--ion-background-color); 
      border-radius: 30px 30px 0 0; 
      margin-top: -30px; 
      position: relative; 
      z-index: 2; 
      padding: 0;
      box-shadow: 0 -10px 40px rgba(17,66,50,0.05);
    }
    .sheet-main { padding: 24px; }

    .price-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .price-value { font-size: 30px; font-weight: 800; color: #114232; letter-spacing: -1px; }
    .rating-tag { background: #ffc409; color: white; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: 14px; cursor: pointer; }
    .review-count-meta { font-size: 13px; color: #114232; font-weight: 600; text-decoration: underline; cursor: pointer; }

    .product-name-heading { font-size: 22px; font-weight: 700; margin: 0 0 12px; color: #333; line-height: 1.3; }
    .meta-info { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .sold-count { font-size: 13px; color: #666; font-weight: 500; }
    .dot-divider { width: 4px; height: 4px; background: #ccc; border-radius: 50%; }
    .stock-status { font-size: 13px; color: #28ba62; font-weight: 600; }
    .stock-status.low-stock { color: #eb445a; }

    .divider-line { height: 1px; background: #eee; margin: 20px 0; }

    .seller-card-premium { 
      background: white; 
      border-radius: 20px; 
      padding: 16px; 
      display: flex; align-items: center; gap: 16px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      border: 1px solid #f5f5f5;
    }
    .avatar-glow { width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #114232 0%, #295546 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px; }
    .seller-info-text { flex: 1; }
    .seller-name-label { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #333; }
    .seller-status { font-size: 11px; color: #666; display: flex; align-items: center; gap: 5px; }
    .status-indicator { width: 6px; height: 6px; background: #28ba62; border-radius: 50%; }


    .section-container { margin-top: 24px; }
    .section-label { font-size: 16px; font-weight: 700; color: #114232; margin-bottom: 12px; }
    .desc-text-premium { color: #555; line-height: 1.7; font-size: 14px; margin: 0; }

    .qty-control-premium { 
      display: flex; align-items: center; background: white; border-radius: 14px; width: fit-content; 
      padding: 6px; border: 1px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .qty-control-premium button { width: 36px; height: 36px; border-radius: 10px; border: none; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #114232; transition: 0.2s; }
    .qty-control-premium button:active { transform: scale(0.9); }
    .qty-number { padding: 0 16px; font-size: 16px; font-weight: 800; color: #333; min-width: 44px; text-align: center; }

    .footer-premium { background: transparent; position: fixed; bottom: 0; width: 100%; border-top: none; pointer-events: none; }
    .action-bar-premium { 
      pointer-events: auto;
      display: flex; gap: 12px; padding: 12px 20px; 
      padding-bottom: calc(16px + env(safe-area-inset-bottom)); 
      background: white; border-radius: 32px 32px 0 0; 
      box-shadow: 0 -15px 40px rgba(17,66,50,0.08); 
      align-items: center;
    }
    .icon-action-btn { 
      flex-shrink: 0; /* Mengunci ukuran ikon agar tidak terhimpit */
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      color: #114232; font-size: 10px; font-weight: 700;
      background: #F9F6F0; padding: 10px; border-radius: 16px;
      min-width: 60px; transition: 0.2s;
    }
    .icon-action-btn:active { transform: scale(0.9); background: #eee; }
    .icon-action-btn ion-icon { font-size: 24px; }
    .cart-btn-wrap { position: relative; }
    .badge-dot { position: absolute; top: 10px; right: 14px; width: 8px; height: 8px; background: #C68E17; border-radius: 50%; border: 2px solid white; }
    
    .buy-now-btn-premium { 
      flex: 1; /* Tombol beli mengambil sisa ruang yang ada */
      --background: linear-gradient(135deg, #114232 0%, #295546 100%);
      --border-radius: 20px; font-weight: 800; font-size: 15px; 
      margin: 0; height: 56px; letter-spacing: 0.5px;
      --box-shadow: 0 8px 25px rgba(17,66,50,0.25);
      text-transform: none;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* ===== REVIEW STYLES ===== */
    .review-section { margin-top: 24px; }
    .review-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .review-count-badge { background: #f0faf5; color: #114232; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #d4ede4; }

    .rating-summary-card { background: white; border-radius: 20px; padding: 18px; display: flex; gap: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); border: 1px solid #f5f5f5; }
    .rating-big { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 72px; }
    .rating-number { font-size: 40px; font-weight: 800; color: #114232; line-height: 1; }
    .stars-row { display: flex; gap: 2px; margin: 6px 0 2px; }
    .star-icon { font-size: 14px; color: #ddd; }
    .star-icon.filled { color: #ffc409; }
    .rating-label { font-size: 10px; color: #999; }
    .rating-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; justify-content: center; }
    .bar-row { display: flex; align-items: center; gap: 8px; }
    .bar-label { font-size: 11px; color: #666; min-width: 18px; text-align: right; }
    .bar-track { flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #ffc409, #C68E17); border-radius: 3px; transition: width 0.6s ease; }
    .bar-count { font-size: 11px; color: #999; min-width: 16px; }

    .empty-review { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 0; }
    .empty-review ion-icon { font-size: 48px; color: #ddd; margin-bottom: 12px; }
    .empty-review p { font-size: 14px; font-weight: 700; color: #444; margin: 0 0 6px; }
    .empty-review span { font-size: 12px; color: #999; }

    .review-list { display: flex; flex-direction: column; gap: 14px; }
    .review-card { background: white; border-radius: 18px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); border: 1px solid #f5f5f5; animation: fadeIn 0.3s ease; }
    .rv-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .rv-avatar { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #114232, #295546); color: white; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .rv-meta { flex: 1; }
    .rv-name { font-size: 13px; font-weight: 700; color: #333; display: block; }
    .rv-stars { display: flex; gap: 2px; margin-top: 2px; }
    .rv-date { font-size: 10px; color: #aaa; flex-shrink: 0; }
    .rv-text { font-size: 13px; color: #555; line-height: 1.6; margin: 0; background: #f9f9f9; padding: 10px 12px; border-radius: 12px; }

    /* Seller Reply Styles */
    .seller-reply-card { margin-top: 10px; padding-left: 14px; position: relative; }
    .reply-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .reply-header .line { width: 2px; height: 12px; background: #C68E17; border-radius: 2px; }
    .reply-header span { font-size: 11px; font-weight: 800; color: #C68E17; text-transform: uppercase; letter-spacing: 0.5px; }
    .reply-text { font-size: 12px; color: #666; line-height: 1.5; margin: 0; background: #FDF9F0; padding: 10px; border-radius: 12px; border: 1px solid #FAF3E0; }

    .show-more-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border-radius: 14px; background: #f0faf5; color: #114232; font-size: 13px; font-weight: 700; border: 1px solid #d4ede4; cursor: pointer; }
    .show-more-btn:active { opacity: 0.7; }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailPage implements OnInit {
  @ViewChild('swiper') swiperEl!: ElementRef;

  product: any;
  isLoading = false;
  isAdding = false;
  isFavorite = false;
  activeSlideIndex = 0;
  quantity: number = 1;
  cartCount: number = 0;
  Number = Number;
  reviews: any[] = [];
  reviewStats = { average: 0, total: 0 };
  ratingBars: { star: number, count: number, pct: number }[] = [];
  isLoadingReviews = false;
  showAllReviews = false;
  trackById(index: number, item: any) { return item?.id || item?.star || index; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public productService: ProductService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const productId = parseInt(id);
      this.fetchProduct(productId);
      this.checkFavoriteStatus(productId);
      this.fetchReviews(productId);
    }
    this.fetchCartCount();
  }

  fetchReviews(productId: number) {
    this.isLoadingReviews = true;
    this.productService.getProductReviews(productId).subscribe({
      next: (res) => {
        this.reviews = res.reviews || [];
        const avg = res.average_rating || 0;
        this.reviewStats = { average: parseFloat(avg.toFixed(1)), total: this.reviews.length };
        // Build bar data
        this.ratingBars = [5, 4, 3, 2, 1].map(star => {
          const count = this.reviews.filter((r: any) => r.rating === star).length;
          return { star, count, pct: this.reviews.length > 0 ? (count / this.reviews.length) * 100 : 0 };
        });
        this.isLoadingReviews = false;
      },
      error: () => this.isLoadingReviews = false
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Hari ini';
    if (diff === 1) return '1 hari lalu';
    if (diff < 30) return `${diff} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  scrollToReviews() {
    const el = document.getElementById('review-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  fetchCartCount() {
    this.cartService.cartCount$.subscribe(count => this.cartCount = count);
  }

  checkFavoriteStatus(id: number) {
    this.productService.checkWishlist(id).subscribe({
      next: (res) => this.isFavorite = res.is_favorite,
      error: () => this.isFavorite = false
    });
  }

  toggleFavorite() {
    if (!this.product) return;
    this.productService.toggleWishlist(this.product.id).subscribe({
      next: (res) => {
        this.isFavorite = res.is_favorite;
        this.presentToast(res.message, 'success', this.isFavorite ? 'heart' : 'heart-outline');
      },
      error: () => this.presentToast('Gagal mengubah favorit', 'danger', 'alert-circle-outline')
    });
  }

  fetchProduct(id: number) {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res;
        this.isLoading = false;
        // Set timeout to ensure Swiper is rendered before adding listener
        setTimeout(() => {
          if (this.swiperEl) {
            const swiperContainer = this.swiperEl.nativeElement;

            // Handle slide change
            const updateIndex = () => {
              if (swiperContainer.swiper) {
                this.activeSlideIndex = swiperContainer.swiper.activeIndex;
                this.cdr.detectChanges();
              }
            };

            swiperContainer.addEventListener('swiperslidechange', updateIndex);
            swiperContainer.addEventListener('slidechange', updateIndex);
            swiperContainer.addEventListener('activeindexchange', updateIndex);
          }
        }, 800);
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  increaseQty() { this.quantity++; }
  decreaseQty() { if (this.quantity > 1) this.quantity--; }

  addToCart(silent: boolean = false) {
    if (!this.product) return;
    this.isAdding = true;
    this.cartService.addToCart(this.product.id, this.quantity, false).subscribe({
      next: (res) => {
        this.isAdding = false;
        this.fetchCartCount();
        if (!silent) this.presentToast(`${this.quantity} produk ditambahkan`, 'success', 'cart-outline');
      },
      error: (err) => { 
        this.isAdding = false; 
        if (err.status === 403) {
          this.presentToast('Akun Penjual / Admin tidak dapat berbelanja', 'warning', 'lock-closed-outline');
        } else {
          this.presentToast('Gagal menambahkan ke keranjang', 'danger', 'alert-circle-outline'); 
        }
      }
    });
  }

  buyNow() {
    if (!this.product) return;
    this.isAdding = true;
    this.cartService.addToCart(this.product.id, this.quantity, true).subscribe({
      next: (res) => {
        this.isAdding = false;
        if (res && res.data) {
          this.router.navigate(['/checkout'], { queryParams: { ids: res.data.id } });
        } else {
          this.router.navigate(['/checkout']);
        }
      },
      error: (err) => { 
        this.isAdding = false; 
        if (err.status === 403) {
          this.presentToast('Akun Penjual / Admin tidak dapat berbelanja', 'warning', 'lock-closed-outline');
        } else {
          this.presentToast('Gagal memproses pembelian', 'danger', 'alert-circle-outline'); 
        }
      }
    });
  }

  goToChat() {
    if (this.product?.seller_id) { this.router.navigate(['/chat', { id: this.product.seller_id, name: this.product.seller.name }]); }
  }

  async presentToast(message: string, color: string, icon: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top', buttons: [{ side: 'start', icon }] });
    toast.present();
  }

  goBack() { window.history.back(); }
  goToCart() { this.router.navigate(['/cart']); }
  goToReviews() { this.router.navigate(['/review-rating']); }
}

@Component({
  selector: 'app-cart',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="tertiary" style="--padding-top: 8px; --padding-bottom: 8px;">
        <ion-buttons slot="start">
          <ion-button (click)="goBack()" fill="clear" color="dark">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="zeven-heading" style="font-weight: 800; color: #114232;">Keranjang Saya</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content pullingText="Tarik untuk memuat ulang..." refreshingSpinner="crescent"></ion-refresher-content>
      </ion-refresher>
      <div *ngIf="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && (!cart || !cart.items || cart.items.length === 0)" class="empty-cart-container">
         <div class="empty-cart-icon"><ion-icon name="cart-outline"></ion-icon></div>
         <h3>Wah, keranjangmu kosong</h3>
         <p>Yuk, cari barang impianmu sekarang!</p>
         <ion-button class="zeven-gradient-btn" (click)="goHome()">Mulai Belanja</ion-button>
      </div>

      <!-- Cart Items -->
      <div *ngIf="!isLoading && cart?.items?.length > 0">
        <div class="cart-item-premium" *ngFor="let item of cart?.items; trackBy: trackById">
          <ion-checkbox color="secondary" [(ngModel)]="item.selected" class="custom-checkbox"></ion-checkbox>
          <div class="product-thumb">
            <img [src]="productService.storageUrl + item.product.image"
                 onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'">
          </div>
          <div class="item-content-premium">
            <h4 class="product-name-short">{{ item.product.name }}</h4>
            <div class="price-and-action">
              <div class="zeven-price">Rp{{ Number(item.product.price * item.quantity).toLocaleString('id-ID') }}</div>
              <div class="qty-control-mini">
                <button (click)="decreaseQty(item)" [disabled]="item.isUpdating">
                  <ion-icon [name]="item.quantity > 1 ? 'remove' : 'trash'" [color]="item.quantity > 1 ? 'primary' : 'danger'"></ion-icon>
                </button>
                <span class="qty-num">{{ item.quantity }}</span>
                <button (click)="increaseQty(item)" [disabled]="item.isUpdating || item.quantity >= item.product.stock">
                  <ion-icon name="add" color="primary"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Voucher Section -->
        <div class="voucher-box-premium">
          <div class="voucher-header-mini">
            <ion-icon name="ticket-outline" color="secondary"></ion-icon>
            <span>Voucher Zeven</span>
          </div>
          <div class="voucher-input-row">
            <input type="text" placeholder="Masukkan kode promo" [(ngModel)]="voucherCode" [readonly]="appliedVoucher">
            <ion-button size="small" [color]="appliedVoucher ? 'danger' : 'secondary'" (click)="appliedVoucher ? removeVoucher() : applyVoucher()">
              {{ appliedVoucher ? 'Batal' : 'Pakai' }}
            </ion-button>
          </div>
          <div *ngIf="appliedVoucher" class="voucher-success-text">
            <ion-icon name="sparkles" color="secondary"></ion-icon>
            Hore! Hemat Rp{{ Number(discountAmount).toLocaleString('id-ID') }}
          </div>
        </div>
      </div>
      <div style="height: 120px; width: 100%;"></div>
    </ion-content>

    <ion-footer class="ion-no-border" *ngIf="cart?.items?.length > 0">
      <div class="total-footer-premium">
        <div class="total-summary-group">
          <span class="total-label">Total Pembayaran</span>
          <div class="zeven-price-large">Rp{{ Number(calculateTotal()).toLocaleString('id-ID') }}</div>
          <span class="discount-label-small" *ngIf="discountAmount > 0">Diskon voucher terpasang</span>
        </div>
        <ion-button class="checkout-btn-premium" (click)="goToCheckout()" [disabled]="getSelectedCount() === 0">
          Checkout ({{ getSelectedCount() }})
        </ion-button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .empty-cart-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; }
    .empty-cart-icon { width: 80px; height: 80px; border-radius: 50%; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ccc; margin-bottom: 20px; }
    .empty-cart-container h3 { font-size: 18px; font-weight: 700; color: #333; margin: 0 0 10px; }
    .empty-cart-container p { font-size: 14px; color: #888; margin: 0 0 24px; }

    .cart-item-premium { 
      background: white; border-radius: 18px; padding: 12px; display: flex; align-items: center; gap: 12px; 
      margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); border: 1px solid #f9f9f9;
    }
    .custom-checkbox { --size: 20px; --border-radius: 6px; margin: 0; }
    .product-thumb { width: 70px; height: 70px; border-radius: 12px; overflow: hidden; background: #f9f9f9; }
    .product-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .item-content-premium { flex: 1; }
    .product-name-short { margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #333; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .price-and-action { display: flex; justify-content: space-between; align-items: center; }
    
    .qty-control-mini { display: flex; align-items: center; background: #F9F6F0; border-radius: 10px; padding: 4px; }
    .qty-control-mini button { background: white; border: none; width: 26px; height: 26px; border-radius: 8px; font-size: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .qty-control-mini button:disabled { opacity: 0.5; }
    .qty-num { padding: 0 10px; font-size: 13px; font-weight: 700; color: #114232; min-width: 30px; text-align: center; }

    .voucher-box-premium { 
      background: #F9F6F0; border-radius: 18px; padding: 16px; margin-top: 20px; 
      border: 1px dashed #C68E17;
    }
    .voucher-header-mini { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #114232; }
    .voucher-input-row { display: flex; gap: 10px; }
    .voucher-input-row input { flex: 1; border: 1px solid #ddd; border-radius: 10px; padding: 8px 12px; font-size: 13px; outline: none; background: white; }
    .voucher-input-row input[readonly] { color: #888; background: #eee; }
    .voucher-success-text { margin-top: 10px; font-size: 12px; color: #114232; font-weight: 700; display: flex; align-items: center; gap: 5px; }

    .total-footer-premium { 
      background: white; padding: 16px 20px; 
      padding-bottom: calc(16px + env(safe-area-inset-bottom)); 
      display: flex; justify-content: space-between; align-items: center;
      border-radius: 24px 24px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,0.05);
    }
    .total-summary-group { flex: 1; }
    .total-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .zeven-price-large { font-size: 22px; font-weight: 800; color: #C68E17; }
    .discount-label-small { font-size: 10px; color: #28ba62; font-weight: 700; }
    .checkout-btn-premium { --border-radius: 14px; font-weight: 700; --background: linear-gradient(135deg, #114232 0%, #295546 100%); margin: 0; min-width: 140px; }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartPage implements OnInit {
  cart: any;
  isLoading = false;
  voucherCode: string = '';
  appliedVoucher: any = null;
  discountAmount: number = 0;
  Number = Number;
  trackById(index: number, item: any) { return item?.id || index; }

  constructor(private router: Router, private cartService: CartService, private orderService: OrderService, public productService: ProductService, private toastCtrl: ToastController) { }
  ngOnInit() { }
  ionViewWillEnter() { this.fetchCart(); }
  doRefresh(event: any) {
    this.fetchCart();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  fetchCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        if (this.cart?.items) this.cart.items.forEach((item: any) => item.selected = true);
        this.isLoading = false;
        if (this.appliedVoucher) this.applyVoucher();
      },
      error: () => this.isLoading = false
    });
  }

  applyVoucher() {
    if (!this.voucherCode.trim()) return;
    this.orderService.checkVoucher(this.voucherCode).subscribe({
      next: (res) => {
        this.appliedVoucher = res;
        const subtotal = this.calculateSubtotal();
        let discount = (subtotal * this.appliedVoucher.discount_percent) / 100;
        if (discount > this.appliedVoucher.max_discount) discount = this.appliedVoucher.max_discount;
        this.discountAmount = discount;
        this.presentToast('Voucher dipasang!', 'success');
      },
      error: (err) => {
        this.presentToast(err.error?.message || 'Kode tidak valid', 'danger');
        this.removeVoucher();
      }
    });
  }

  removeVoucher() {
    this.appliedVoucher = null;
    this.voucherCode = '';
    this.discountAmount = 0;
  }

  increaseQty(item: any) { this.updateQty(item, item.quantity + 1); }
  decreaseQty(item: any) { if (item.quantity > 1) { this.updateQty(item, item.quantity - 1); } else { this.remove(item.id); } }
  updateQty(item: any, newQty: number) {
    item.isUpdating = true;
    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        item.isUpdating = false;
        if (this.appliedVoucher) this.applyVoucher();
      },
      error: () => item.isUpdating = false
    });
  }
  remove(itemId: number) { this.cartService.removeItem(itemId).subscribe({ next: () => this.fetchCart() }); }
  getSelectedCount() { return this.cart?.items?.filter((item: any) => item.selected).length || 0; }
  calculateSubtotal() { return this.cart?.items?.reduce((total: number, item: any) => item.selected ? total + (item.product.price * item.quantity) : total, 0) || 0; }
  calculateTotal() { return this.calculateSubtotal() - this.discountAmount; }

  goBack() { window.history.back(); }
  goHome() { this.router.navigate(['/tabs/home']); }

  goToCheckout() {
    const selectedIds = this.cart.items?.filter((i: any) => i.selected).map((i: any) => i.id) || [];
    this.router.navigate(['/checkout'], {
      queryParams: {
        ids: selectedIds.join(','),
        voucher: this.appliedVoucher ? this.voucherCode : ''
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    toast.present();
  }
}

@Component({
  selector: 'app-checkout',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="tertiary" style="--padding-top: 8px; --padding-bottom: 8px;">
        <ion-buttons slot="start">
          <ion-button (click)="goBack()" fill="clear" color="dark">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="zeven-heading" style="font-weight: 800; color: #114232;">Konfirmasi Pesanan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg ion-padding">
      <!-- Shipping Address -->
      <div class="checkout-card">
        <div class="card-header-mini">
           <ion-icon name="location-outline" color="secondary"></ion-icon>
           <h3>Alamat Pengiriman</h3>
           <a (click)="goToAddressList()" class="edit-link">Ubah</a>
        </div>
        <div class="address-content" *ngIf="selectedAddress; else noAddress">
           <div class="receiver-info">
             <strong>{{ selectedAddress.receiver_name }}</strong>
             <span>{{ selectedAddress.phone_number }}</span>
           </div>
           <p class="full-address-text">{{ selectedAddress.full_address }}</p>
        </div>
        <ng-template #noAddress>
           <div class="address-empty-state" (click)="goToAddressList()">
             <ion-icon name="add-circle-outline"></ion-icon>
             <span>Tambah alamat pengiriman</span>
           </div>
        </ng-template>
      </div>

      <!-- Order Items -->
      <div class="checkout-card" *ngIf="filteredItems.length > 0">
        <div class="card-header-mini">
           <ion-icon name="bag-handle-outline" color="secondary"></ion-icon>
           <h3>Pesanan Kamu</h3>
        </div>
        <div class="checkout-item-row" *ngFor="let item of filteredItems; trackBy: trackById">
          <img [src]="productService.storageUrl + item.product.image" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100'">
          <div class="item-meta">
            <h4>{{ item.product.name }}</h4>
            <div class="price-qty-row">
              <span class="zeven-price">Rp{{ Number(item.product.price).toLocaleString('id-ID') }}</span>
              <span class="qty-pill">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Voucher Section -->
      <div class="checkout-card">
        <div class="card-header-mini">
           <ion-icon name="ticket-outline" color="secondary"></ion-icon>
           <h3>Voucher</h3>
        </div>
        <div class="voucher-input-group">
          <input type="text" placeholder="Gunakan kode voucher" [(ngModel)]="voucherCode" [readonly]="appliedVoucher">
          <ion-button size="small" [color]="appliedVoucher ? 'danger' : 'secondary'" (click)="appliedVoucher ? removeVoucher() : applyVoucher()">
            {{ appliedVoucher ? 'Batal' : 'Pakai' }}
          </ion-button>
        </div>
        <div *ngIf="appliedVoucher" class="applied-msg">
          <ion-icon name="checkmark-circle" color="success"></ion-icon>
          <span>Hemat Rp{{ Number(discountAmount).toLocaleString('id-ID') }} dari voucher!</span>
        </div>
      </div>

      <!-- Price Summary -->
      <div class="checkout-card summary-card-premium">
        <h3>Ringkasan Pembayaran</h3>
        <div class="summ-row"><span>Total Harga</span><span>Rp{{ Number(calculateSubtotal()).toLocaleString('id-ID') }}</span></div>
        <div class="summ-row" *ngIf="discountAmount > 0" color="success"><span>Diskon Voucher</span><span>-Rp{{ Number(discountAmount).toLocaleString('id-ID') }}</span></div>
        <div class="summ-row"><span>Biaya Layanan Aplikasi</span><span>Rp1.000</span></div>
        <div class="divider-dash"></div>
        <div class="summ-row grand-total"><span>Total Tagihan</span><span class="zeven-price-large">Rp{{ Number(calculateTotal()).toLocaleString('id-ID') }}</span></div>
      </div>
      <div style="height: 100px;"></div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <div class="checkout-bar-premium">
        <div class="billing-info">
          <span class="lab">Total Bayar</span>
          <div class="zeven-price-large">Rp{{ Number(calculateTotal()).toLocaleString('id-ID') }}</div>
        </div>
        <ion-button class="place-order-btn" (click)="placeOrder()" [disabled]="isLoading">
          {{ isLoading ? 'Memproses...' : 'Buat Pesanan' }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .checkout-card { background: white; border-radius: 20px; padding: 18px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f9f9f9; }
    .card-header-mini { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; position: relative; }
    .card-header-mini h3 { margin: 0; font-size: 15px; font-weight: 700; color: #114232; flex: 1; }
    .edit-link { font-size: 13px; font-weight: 700; color: #C68E17; }
    
    .receiver-info { margin-bottom: 6px; }
    .receiver-info strong { font-size: 15px; color: #333; }
    .receiver-info span { font-size: 13px; color: #888; margin-left: 8px; }
    .full-address-text { margin: 0; font-size: 13px; color: #666; line-height: 1.5; }
    .address-empty-state { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; border: 1.5px dashed #ccc; border-radius: 12px; color: #888; }

    .checkout-item-row { display: flex; gap: 14px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f5f5f5; }
    .checkout-item-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .checkout-item-row img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; }
    .item-meta { flex: 1; }
    .item-meta h4 { margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #444; }
    .price-qty-row { display: flex; justify-content: space-between; align-items: center; }
    .qty-pill { background: #F9F6F0; color: #114232; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; }

    .voucher-input-group { display: flex; gap: 10px; }
    .voucher-input-group input { flex: 1; border: 1px solid #eee; border-radius: 10px; padding: 10px 14px; font-size: 13px; outline: none; background: #fafafa; }
    .applied-msg { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 12px; font-weight: 700; color: #28ba62; }

    .summary-card-premium h3 { font-size: 15px; margin: 0 0 16px; }
    .summ-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666; }
    .summ-row[color="success"] { color: #28ba62; font-weight: 700; }
    .divider-dash { height: 1px; border-top: 1px dashed #ddd; margin: 12px 0; }
    .grand-total { margin-top: 10px; color: #114232; }

    .checkout-bar-premium { 
      background: white; padding: 16px 20px; 
      padding-bottom: calc(16px + env(safe-area-inset-bottom)); 
      display: flex; justify-content: space-between; align-items: center;
      border-radius: 24px 24px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,0.08);
    }
    .billing-info { flex: 1; }
    .lab { font-size: 11px; color: #888; text-transform: uppercase; }
    .place-order-btn { --border-radius: 14px; font-weight: 700; --background: linear-gradient(135deg, #C68E17 0%, #A67B12 100%); margin: 0; min-width: 150px; }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutPage implements OnInit {
  cart: any;
  filteredItems: any[] = [];
  shippingAddress: string = '';
  selectedAddress: any = null;
  isLoading = false;
  voucherCode: string = '';
  appliedVoucher: any = null;
  discountAmount: number = 0;
  Number = Number;
  trackById(index: number, item: any) { return item?.id || index; }

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private cartService: CartService, 
    private orderService: OrderService, 
    public productService: ProductService, 
    private addressService: AddressService, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.fetchCart();
    // Tangkap voucher dari query params jika ada
    const voucherFromCart = this.route.snapshot.queryParamMap.get('voucher');
    if (voucherFromCart) {
      this.voucherCode = voucherFromCart;
      setTimeout(() => this.applyVoucher(), 500);
    }
  }

  ionViewWillEnter() { this.fetchMainAddress(); }

  fetchMainAddress() {
    this.addressService.getAddresses().subscribe({
      next: (res: any[]) => {
        const main = res.find(a => a.is_main) || res[0];
        if (main) { this.selectedAddress = main; this.shippingAddress = `${main.receiver_name} (${main.phone_number}), ${main.full_address}`; }
      }
    });
  }

  goToAddressList() { this.router.navigate(['/address-list']); }

  fetchCart() {
    const selectedIds = this.route.snapshot.queryParamMap.get('ids')?.split(',') || [];
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        if (this.cart?.items) this.filteredItems = this.cart.items.filter((item: any) => selectedIds.includes(item.id.toString()));
        if (this.appliedVoucher) this.applyVoucher();
      }
    });
  }

  calculateSubtotal() { return this.filteredItems.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0); }
  calculateTotal() { return this.calculateSubtotal() - this.discountAmount + 1000; }

  applyVoucher() {
    if (!this.voucherCode.trim()) return;
    this.orderService.checkVoucher(this.voucherCode).subscribe({
      next: (res) => {
        this.appliedVoucher = res;
        const subtotal = this.calculateSubtotal();
        let discount = (subtotal * this.appliedVoucher.discount_percent) / 100;
        if (discount > this.appliedVoucher.max_discount) discount = this.appliedVoucher.max_discount;
        this.discountAmount = discount;
      },
      error: () => this.removeVoucher()
    });
  }

  removeVoucher() {
    this.appliedVoucher = null;
    this.voucherCode = '';
    this.discountAmount = 0;
  }

  placeOrder() {
    if (!this.shippingAddress) { this.presentToast('Alamat belum dipilih', 'warning'); return; }
    this.isLoading = true;
    const cartItemIds = this.filteredItems.map(item => item.id);
    this.orderService.checkout(this.shippingAddress, this.voucherCode, cartItemIds).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.order && res.order.snap_token) {
          (window as any).snap.pay(res.order.snap_token, {
            onSuccess: (result: any) => {
              this.presentToast('Pembayaran Berhasil!', 'success');
              this.router.navigate(['/tabs/history']);
            },
            onPending: (result: any) => {
              this.presentToast('Menunggu pembayaran diselesaikan', 'warning');
              this.router.navigate(['/order-tracking', { id: res.order.id }]);
            },
            onError: (result: any) => {
              this.presentToast('Pembayaran gagal', 'danger');
              this.router.navigate(['/order-tracking', { id: res.order.id }]);
            },
            onClose: () => {
              this.presentToast('Anda menutup pop-up pembayaran sebelum menyelesaikannya', 'warning');
              this.router.navigate(['/order-tracking', { id: res.order.id }]);
            }
          });
        } else if (res && res.order && res.order.id) {
          this.showSuccessAlert(res.order.id, res.order.final_price);
        } else {
          this.presentToast('Pesanan Berhasil!', 'success');
          this.router.navigate(['/tabs/history']);
        }
      },
      error: (err) => { this.isLoading = false; this.presentToast(err.error?.message || 'Gagal', 'danger'); }
    });
  }

  async showSuccessAlert(orderId: number, totalPrice: number) {
    const alert = await this.alertCtrl.create({
      header: 'Pesanan Berhasil! 🎉',
      subHeader: 'Langkah Selanjutnya: Pembayaran',
      message: `Pesanan Anda telah berhasil dibuat. Silakan lakukan pembayaran sebesar Rp${Number(totalPrice).toLocaleString('id-ID')} ke rekening BCA kami di halaman berikutnya, lalu unggah bukti transfer.`,
      buttons: [
        {
          text: 'Bayar Sekarang',
          handler: () => {
            this.router.navigate(['/order-tracking', { id: orderId }]);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    toast.present();
  }

  goBack() { window.history.back(); }
}

@Component({
  selector: 'app-wishlist',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="tertiary" style="--padding-top: 8px; --padding-bottom: 8px;">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/profile" color="dark"></ion-back-button>
        </ion-buttons>
        <ion-title class="zeven-heading" style="font-weight: 800; color: #114232;">Favorit Saya</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg">
      <div *ngIf="isLoading" class="ion-text-center ion-padding" style="margin-top: 40px;">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && products.length === 0" class="empty-state">
        <div class="empty-icon-container">
          <ion-icon name="heart-dislike-outline"></ion-icon>
        </div>
        <h3>Belum ada produk favorit</h3>
        <p>Produk yang kamu tandai sebagai favorit akan muncul di sini.</p>
        <ion-button class="zeven-gradient-btn" (click)="goHome()" style="margin-top: 24px; --padding-start: 32px; --padding-end: 32px;">
          Cari Produk Sekarang
        </ion-button>
      </div>

      <!-- Wishlist Grid -->
      <div class="wishlist-grid" *ngIf="!isLoading && products.length > 0">
        <div class="premium-wish-card fade-in" *ngFor="let product of products" (click)="goToDetail(product.id)">
          <div class="card-image-box">
            <img [src]="product.image ? (productService.storageUrl + product.image) : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300'" 
                 (error)="$any($event.target).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300'">
            <div class="remove-wish-btn" (click)="removeFavorite(product.id); $event.stopPropagation()">
              <ion-icon name="heart" color="danger"></ion-icon>
            </div>
          </div>
          <div class="card-info-box">
            <h4 class="wish-prod-name">{{ product.name }}</h4>
            <div class="wish-prod-price">Rp{{ Number(product.price || 0).toLocaleString('id-ID') }}</div>
            <div class="wish-prod-seller">
              <ion-icon name="storefront-outline"></ion-icon>
              <span>{{ product.seller?.name || 'Zeven Store' }}</span>
            </div>
            <ion-button fill="outline" class="btn-detail" size="small" (click)="goToDetail(product.id); $event.stopPropagation()">
              Cek Detail
            </ion-button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .empty-state { 
      display: flex; flex-direction: column; align-items: center; justify-content: center; 
      height: 70vh; padding: 40px; text-align: center; 
    }
    .empty-icon-container { 
      width: 100px; height: 100px; background: rgba(198,142,23,0.1); 
      border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      margin-bottom: 24px; color: #C68E17; font-size: 50px;
    }
    .empty-state h3 { font-size: 18px; font-weight: 800; color: #333; margin-bottom: 8px; }
    .empty-state p { font-size: 14px; color: #888; }

    .wishlist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; }
    
    .premium-wish-card { 
      background: white; border-radius: 20px; overflow: hidden; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.04); border: 1px solid #f5f5f5;
      display: flex; flex-direction: column;
      height: 100%;
    }
    .card-image-box { position: relative; width: 100%; padding-top: 100%; background: #f9f9f9; }
    .card-image-box img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    
    .remove-wish-btn { 
      position: absolute; top: 8px; right: 8px; background: white; 
      width: 32px; height: 32px; border-radius: 50%; display: flex; 
      align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }
    
    .card-info-box { padding: 12px; flex: 1; display: flex; flex-direction: column; }
    .wish-prod-name { 
      margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #333; 
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; 
      overflow: hidden; min-height: 36px;
    }
    .wish-prod-price { font-size: 15px; font-weight: 800; color: #C68E17; margin-bottom: 8px; }
    .wish-prod-seller { display: flex; align-items: center; gap: 6px; color: #888; font-size: 11px; margin-bottom: 12px; }
    .wish-prod-seller ion-icon { font-size: 14px; color: #114232; }
    
    .btn-detail { --border-radius: 10px; font-size: 11px; font-weight: 700; text-transform: none; --color: #114232; --border-color: #114232; margin: 0; height: 36px; }
    
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WishlistPage implements OnInit {
  products: any[] = [];
  isLoading = false;
  Number = Number;
  constructor(
    private router: Router,
    public productService: ProductService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }
  ngOnInit() { }

  ionViewWillEnter() {
    this.fetchWishlist();
  }

  fetchWishlist() {
    this.isLoading = true;
    this.productService.getWishlist().subscribe({ next: (res) => { this.products = res; this.isLoading = false; }, error: () => this.isLoading = false });
  }
  removeFavorite(productId: number) {
    this.productService.toggleWishlist(productId).subscribe({ next: () => { this.products = this.products.filter(p => p.id !== productId); } });
  }
  goToDetail(id: number) { this.router.navigate(['/product-detail', id]); }
  goBack() { this.navCtrl.back(); }
  goHome() { this.router.navigate(['/tabs/home']); }
}



