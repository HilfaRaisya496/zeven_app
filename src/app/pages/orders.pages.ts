import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-orders',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: #114232; --padding-top: 8px; --padding-bottom: 8px;">
        <ion-title class="zeven-heading" style="font-weight: 800; color: #ffffff;">Pesanan Saya</ion-title>
      </ion-toolbar>
      <ion-toolbar color="tertiary">
        <ion-segment [(ngModel)]="activeSegment" (ionChange)="onSegmentChange()" color="primary" mode="md" class="custom-segment">
          <ion-segment-button value="pending">
            <ion-label>Berlangsung</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Selesai</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="zeven-bg ion-padding">
      <div *ngIf="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && orders.length === 0" class="empty-orders-state">
        <div class="empty-icon-glow">
          <ion-icon name="receipt-outline"></ion-icon>
        </div>
        <h3>Belum ada pesanan</h3>
        <p>Yuk, mulai belanja barang impianmu!</p>
        <ion-button class="zeven-gradient-btn" (click)="goToHome()">Belanja Sekarang</ion-button>
      </div>

      <!-- Order Cards -->
      <div class="order-card-premium" *ngFor="let order of filteredOrders; trackBy: trackById">
        <div class="order-main-click" (click)="goToTracking(order.id)">
          <div class="order-top-row">
            <div class="seller-preview">
              <ion-icon name="storefront" color="secondary"></ion-icon>
              <span>{{ order.seller?.name || 'Zeven Seller' }}</span>
            </div>
            <div class="badge-status-premium" [ngClass]="order.status">
              {{ getStatusLabel(order.status) }}
            </div>
          </div>

          <div class="order-body-premium">
            <img [src]="productService.storageUrl + order.items[0]?.product?.image" 
                 onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150'">
            <div class="item-meta-info">
              <h4 class="prod-name-title">{{ order.items[0]?.product?.name }}</h4>
              <p class="qty-label-sub">{{ order.items[0]?.quantity }} barang</p>
              <div class="price-mini">Rp{{ Number(order.items[0]?.price).toLocaleString('id-ID') }}</div>
            </div>
          </div>

          <div class="extra-items-badge" *ngIf="order.items.length > 1">
            +{{ order.items.length - 1 }} Produk Lainnya
          </div>
        </div>

        <div class="order-divider"></div>

        <div class="order-footer-premium">
          <div class="price-billing-stack">
            <span class="billing-label">Total Pesanan</span>
            <div class="final-price-text">Rp{{ Number(order.final_price).toLocaleString('id-ID') }}</div>
          </div>
          <div class="action-btn-group">
            <ion-button size="small" fill="outline" color="primary" class="round-8-btn" *ngIf="order.status !== 'completed'" (click)="$event.stopPropagation(); goToChat(order.seller_id)">Hubungi Penjual</ion-button>
            <ion-button size="small" fill="outline" color="secondary" class="round-8-btn" *ngIf="order.status === 'completed'" (click)="$event.stopPropagation(); goToReview(order.id, order.items[0]?.product_id)" [disabled]="order.items[0]?.is_reviewed">
              <ion-icon [name]="order.items[0]?.is_reviewed ? 'checkmark-circle' : 'star-outline'" slot="start" *ngIf="order.items[0]?.is_reviewed"></ion-icon>
              {{ order.items[0]?.is_reviewed ? 'Sudah Diulas' : 'Beri Ulasan' }}
            </ion-button>
            <ion-button size="small" color="primary" class="round-8-btn highlight-btn" *ngIf="order.status === 'completed'" (click)="$event.stopPropagation(); buyAgain(order.items[0]?.product_id)">Beli Lagi</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .custom-segment { --background: white; border-bottom: 1px solid #f0f0f0; }
    .empty-orders-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; }
    .empty-icon-glow { width: 80px; height: 80px; background: #F9F6F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #C68E17; margin-bottom: 20px; }
    .empty-orders-state h3 { font-size: 18px; font-weight: 700; color: #333; margin: 0 0 8px; }
    .empty-orders-state p { font-size: 14px; color: #888; margin-bottom: 24px; }

    .order-card-premium { background: white; border-radius: 20px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f9f9f9; }
    .order-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .seller-preview { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #114232; }
    .badge-status-premium { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .badge-status-premium.pending { background: #fff7e6; color: #faad14; }
    .badge-status-premium.processing { background: #e6f7ff; color: #1890ff; }
    .badge-status-premium.completed { background: #f6ffed; color: #28ba62; }
    .badge-status-premium.cancelled { background: #fff1f0; color: #f5222d; }

    .order-body-premium { display: flex; gap: 14px; margin-bottom: 12px; }
    .order-body-premium img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
    .item-meta-info { flex: 1; }
    .prod-name-title { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #333; }
    .qty-label-sub { font-size: 12px; color: #888; margin: 0 0 6px; }
    .price-mini { font-size: 13px; font-weight: 600; color: #666; }

    .extra-items-badge { font-size: 11px; font-weight: 700; color: #888; text-align: center; background: #f9f9f9; padding: 4px; border-radius: 8px; margin-top: 4px; }
    .order-divider { height: 1px; background: #f5f5f5; margin: 16px 0; }

    .order-footer-premium { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; }
    .price-billing-stack { flex: 1; min-width: 120px; }
    .billing-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
    .final-price-text { font-size: 18px; font-weight: 800; color: #C68E17; }

    .action-btn-group { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .round-8-btn { --border-radius: 10px; font-weight: 700; text-transform: none; margin: 0; min-height: 36px; }
    .highlight-btn { --background: linear-gradient(135deg, #114232 0%, #295546 100%); --color: white; --box-shadow: 0 4px 12px rgba(17,66,50,0.2); }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersPage implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  activeSegment: string = 'pending';
  isLoading = false;
  Number = Number;
  trackById(index: number, item: any) { return item?.id || index; }

  constructor(
    private orderService: OrderService,
    public productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  ionViewWillEnter() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.filterOrders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSegmentChange() {
    this.filterOrders();
  }

  filterOrders() {
    if (this.activeSegment === 'pending') {
      this.filteredOrders = this.orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'processing': return 'Diproses';
      case 'shipped': return 'Dikirim';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  }

  goBack() { this.router.navigate(['/tabs/home']); }
  goToHome() { this.router.navigate(['/tabs/home']); }
  goToTracking(orderId: number) { this.router.navigate(['/order-tracking', { id: orderId }]); }
  goToReview(orderId: number, productId: number) {
    this.router.navigate(['/review-rating', { order_id: orderId, product_id: productId }]);
  }
  goToChat(sellerId: number) { this.router.navigate(['/chat', { id: sellerId }]); }
  buyAgain(productId: number) { this.router.navigate(['/product-detail', productId]); }
}
import { FormsModule } from '@angular/forms';
