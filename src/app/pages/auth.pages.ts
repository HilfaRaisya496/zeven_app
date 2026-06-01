import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-splash',
  template: `
    <ion-content class="zeven-bg ion-padding" scrollY="false">
      <div class="splash-container">
        <div class="logo-wrapper">
          <!-- Mocking the Zeven Logo -->
          <div class="logo">
            <span class="z">Z</span>
            <span class="seven">7</span>
          </div>
          <h1 class="brand-name">Zeven</h1>
          <p class="tagline">Marketplace Social Commerce</p>
        </div>
        <div class="loader">
          <ion-spinner color="secondary"></ion-spinner>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .splash-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: var(--ion-color-tertiary);
    }
    .logo-wrapper {
      text-align: center;
      animation: fadeIn 1.2s ease-out forwards;
    }
    .logo {
      font-size: 80px;
      font-weight: 800;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }
    .z { color: var(--ion-color-primary); margin-right: -10px; z-index: 2; }
    .seven { color: var(--ion-color-secondary); z-index: 1; }
    .brand-name {
      font-size: 32px;
      font-weight: 700;
      color: var(--ion-color-primary);
      margin: 0;
      letter-spacing: 1px;
    }
    .tagline {
      font-size: 14px;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 8px;
    }
    .loader {
      position: absolute;
      bottom: 50px;
      animation: fadeIn 2s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplashPage {
  constructor(private router: Router, private authService: AuthService) {
    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        const user = this.authService.getCurrentUser();
        if (user && !localStorage.getItem('hasAgreedTerms_' + user.id)) {
          this.router.navigate(['/onboarding']);
        } else {
          this.router.navigate(['/tabs/home']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }, 2500);
  }
}

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="zeven-bg" scrollY="false">
      <swiper-container [pagination]="true" style="height: 100%;">
        
        <!-- Slide 1 -->
        <swiper-slide>
          <div class="onboarding-slide">
            <div class="illustration">
              <div class="circle-bg"></div>
              <ion-icon name="cart-outline" class="main-icon"></ion-icon>
            </div>
            <div class="text-content">
              <h1 class="zeven-heading">Temukan & Belanja</h1>
              <p>Rasakan kemudahan berbelanja. Terhubung langsung dengan penjual melalui fitur obrolan (chat), dan beli produk impian Anda dengan mudah.</p>
            </div>
          </div>
        </swiper-slide>
        
        <!-- Slide 2 -->
        <swiper-slide>
          <div class="onboarding-slide">
            <div class="illustration">
              <div class="circle-bg" style="background: linear-gradient(135deg, rgba(40,186,98,0.1) 0%, rgba(17,66,50,0.1) 100%);"></div>
              <ion-icon name="people-outline" class="main-icon"></ion-icon>
            </div>
            <div class="text-content">
              <h1 class="zeven-heading">Komunitas Zeven</h1>
              <p>Bergabung dengan ribuan pengguna. Bangun reputasi Anda dan temukan penawaran terbaik setiap harinya dari penjual terpercaya.</p>
            </div>
          </div>
        </swiper-slide>
        
        <!-- Slide 3 -->
        <swiper-slide>
          <div class="onboarding-slide">
            <div class="illustration">
              <div class="circle-bg" style="background: linear-gradient(135deg, rgba(198,142,23,0.1) 0%, rgba(40,186,98,0.1) 100%);"></div>
              <ion-icon name="shield-checkmark-outline" class="main-icon"></ion-icon>
            </div>
            <div class="text-content">
              <h1 class="zeven-heading">Aman & Terpercaya</h1>
              <p>Transaksi dilindungi keamanan tingkat tinggi. Silakan baca Kebijakan Privasi kami untuk mulai menggunakan aplikasi.</p>
            </div>
            <div class="actions">
              <div class="terms-checkbox" (click)="openTermsModal()">
                <ion-checkbox [(ngModel)]="agreedToTerms" color="primary" disabled></ion-checkbox>
                <span class="terms-text">
                  Saya menyetujui <a style="cursor:pointer; color:var(--ion-color-primary);">Syarat & Ketentuan dan Kebijakan Privasi</a>.
                </span>
              </div>
              <ion-button expand="block" class="zeven-gradient-btn" (click)="getStarted()" [disabled]="!agreedToTerms">
                Mulai Belanja
              </ion-button>
            </div>
          </div>
        </swiper-slide>
        
      </swiper-container>

      <!-- Terms Modal -->
      <ion-modal [isOpen]="isTermsModalOpen" (didDismiss)="isTermsModalOpen = false">
        <ng-template>
          <ion-header class="ion-no-border">
            <ion-toolbar>
              <ion-title>Kebijakan Privasi</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeTermsModal()">Tutup</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding terms-scroll-content" [scrollEvents]="true" (ionScroll)="onScroll($event)">
            <div class="terms-document">
              <h3>1. Pendahuluan</h3>
              <p>Selamat datang di Zeven. Dengan menggunakan aplikasi ini, Anda setuju untuk terikat dengan Syarat & Ketentuan ini. Zeven adalah platform Social Commerce yang memfasilitasi transaksi antara penjual dan pembeli.</p>
              
              <h3>2. Data Pribadi</h3>
              <p>Kami mengumpulkan data pribadi Anda (seperti nama, email, dan alamat pengiriman) hanya untuk keperluan pemrosesan pesanan dan peningkatan layanan. Data Anda dienkripsi dan disimpan dengan aman.</p>
              
              <h3>3. Pembayaran & Transaksi</h3>
              <p>Semua transaksi pembayaran diproses melalui gateway pembayaran resmi (Midtrans) yang dijamin keamanannya. Kami tidak menyimpan detail kartu kredit/debit Anda di server kami.</p>
              
              <h3>4. Kebijakan Pemesanan</h3>
              <p>Pesanan yang telah berhasil dibayar akan langsung diteruskan ke penjual. Harap pastikan kembali detail pesanan Anda sebelum melakukan pembayaran akhir.</p>

              <h3>5. Tanggung Jawab Penjual</h3>
              <p>Penjual bertanggung jawab penuh atas kualitas produk yang dikirimkan. Segala bentuk penipuan akan ditindak secara tegas dan akun akan di-banned permanen.</p>

              <h3>6. Penyelesaian Sengketa</h3>
              <p>Jika terjadi perselisihan antara pembeli dan penjual, Zeven akan bertindak sebagai mediator untuk mencari jalan tengah yang adil bagi kedua belah pihak.</p>
              
              <div style="height: 150px; display:flex; align-items:flex-end; justify-content:center;">
                 <p style="color:var(--ion-color-medium); font-size:13px; font-weight:600; animation: bounce 2s infinite;">⬇ Scroll ke bawah untuk menyetujui ⬇</p>
              </div>
              <div style="height: 50px;"></div>
            </div>
          </ion-content>
          <ion-footer class="ion-no-border" style="padding: 16px;">
            <ion-button expand="block" [color]="hasReadTerms ? 'primary' : 'medium'" [disabled]="!hasReadTerms" (click)="agreeToTerms()" class="zeven-gradient-btn" style="opacity: {{hasReadTerms ? 1 : 0.6}};">
              {{ hasReadTerms ? 'Saya Setuju' : 'Baca Sampai Akhir' }}
            </ion-button>
          </ion-footer>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    swiper-container {
      --swiper-pagination-color: var(--ion-color-primary);
      --swiper-pagination-bullet-inactive-color: var(--ion-color-medium);
      --swiper-pagination-bullet-inactive-opacity: 0.3;
      --swiper-pagination-bullet-size: 8px;
    }
    .onboarding-slide {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 40px 24px 80px;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .illustration {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      max-height: 350px;
    }
    .circle-bg {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(17,66,50,0.1) 0%, rgba(198,142,23,0.1) 100%);
      position: absolute;
    }
    .main-icon {
      font-size: 100px;
      color: var(--ion-color-primary);
      z-index: 2;
    }
    .text-content {
      text-align: center;
      margin-bottom: 20px;
      width: 100%;
    }
    .text-content h1 {
      font-size: 28px;
      margin-bottom: 16px;
    }
    .text-content p {
      color: var(--ion-color-medium);
      line-height: 1.6;
      font-size: 16px;
    }
    .actions {
      width: 100%;
      margin-top: 10px;
    }
    .terms-checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      padding: 10px;
      background: rgba(40,186,98,0.05);
      border-radius: 8px;
      border: 1px solid rgba(40,186,98,0.2);
    }
    .terms-checkbox ion-checkbox {
      --size: 20px;
      pointer-events: none;
    }
    .terms-text {
      font-size: 13px;
      color: var(--ion-color-medium);
      line-height: 1.4;
      text-align: left;
    }
    .terms-document h3 {
      font-size: 16px;
      color: var(--ion-color-dark);
      margin-top: 20px;
      font-weight: 700;
    }
    .terms-document p {
      font-size: 14px;
      color: var(--ion-color-medium);
      line-height: 1.6;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-10px);}
      60% {transform: translateY(-5px);}
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingPage {
  agreedToTerms = false;
  isTermsModalOpen = false;
  hasReadTerms = false;
  
  constructor(private router: Router, private authService: AuthService) { }
  
  getStarted() {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    // Simpan status bahwa user ini sudah menyetujui terms
    const user = this.authService.getCurrentUser();
    if (user) {
      localStorage.setItem('hasAgreedTerms_' + user.id, 'true');
    }
    this.router.navigate(['/tabs/home']);
  }

  openTermsModal() {
    if(!this.agreedToTerms) {
      this.isTermsModalOpen = true;
    }
  }

  closeTermsModal() {
    this.isTermsModalOpen = false;
  }

  agreeToTerms() {
    this.agreedToTerms = true;
    this.isTermsModalOpen = false;
  }

  onScroll(event: any) {
    if (this.hasReadTerms) return;
    
    // Fallback detection using event detail if getScrollElement is tricky
    // Actually, in Ionic the easiest way is to use event.target
    const scrollElement = event.target;
    scrollElement.getScrollElement().then((el: HTMLElement) => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
        this.hasReadTerms = true;
      }
    });
  }
}

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="zeven-bg">
      <div class="auth-header">
        <div class="logo-small">
          <span class="z">Z</span><span class="seven">7</span>
        </div>
        <h1 class="zeven-heading">Selamat Datang</h1>
        <p class="zeven-subheading">Masuk untuk melanjutkan ke Zeven</p>
      </div>

      <div class="auth-form ion-padding">
        <ion-item lines="none" class="zeven-input">
          <ion-icon name="mail-outline" slot="start" color="medium"></ion-icon>
          <ion-input type="email" placeholder="Alamat Email" [(ngModel)]="email"></ion-input>
        </ion-item>

        <ion-item lines="none" class="zeven-input">
          <ion-icon name="lock-closed-outline" slot="start" color="medium"></ion-icon>
          <ion-input [type]="showPassword ? 'text' : 'password'" placeholder="Kata Sandi" [(ngModel)]="password"></ion-input>
          <ion-icon [name]="showPassword ? 'eye-off-outline' : 'eye-outline'" slot="end" color="medium" (click)="togglePassword()"></ion-icon>
        </ion-item>

        <div class="forgot-password">
          <a (click)="forgotPassword()" style="cursor: pointer;">Lupa Kata Sandi?</a>
        </div>

        <ion-button expand="block" class="zeven-gradient-btn ion-margin-top" (click)="login()" [disabled]="isLoading">
          <ion-spinner name="crescent" *ngIf="isLoading" slot="start"></ion-spinner>
          Masuk
        </ion-button>


        <div class="register-link">
          Belum punya akun? <a (click)="goToRegister()">Daftar</a>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-header {
      padding: 60px 24px 30px;
    }
    .logo-small {
      font-size: 40px;
      font-weight: 800;
      margin-bottom: 16px;
    }
    .z { color: var(--ion-color-primary); margin-right: -5px; }
    .seven { color: var(--ion-color-secondary); }
    .forgot-password {
      text-align: right;
      margin-top: 8px;
    }
    .forgot-password a {
      color: var(--ion-color-secondary);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
    }
    .divider {
      text-align: center;
      margin: 30px 0;
      position: relative;
    }
    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 40%;
      height: 1px;
      background: var(--ion-color-medium);
      opacity: 0.2;
    }
    .divider::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      width: 40%;
      height: 1px;
      background: var(--ion-color-medium);
      opacity: 0.2;
    }
    .divider span {
      background: var(--ion-background-color);
      padding: 0 10px;
      color: var(--ion-color-medium);
      font-size: 14px;
      font-weight: 500;
    }
    .social-login {
      display: flex;
      gap: 16px;
    }
    .social-btn {
      flex: 1;
      --border-radius: 12px;
      --border-color: rgba(0,0,0,0.1);
      --border-width: 1px;
      text-transform: none;
      font-weight: 500;
    }
    .register-link {
      text-align: center;
      margin-top: 40px;
      color: var(--ion-color-medium);
      font-size: 14px;
    }
    .register-link a {
      color: var(--ion-color-primary);
      font-weight: 600;
      cursor: pointer;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    this.presentToast('Silakan kirim email ke ubp.event.management@gmail.com untuk bantuan reset sandi.', 'warning', 'information-circle-outline');
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Harap isi semua kolom', 'warning', 'information-circle-outline');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.presentToast('Selamat Datang Kembali!', 'success', 'checkmark-circle-outline');
        
        const userId = res.user?.id;
        if (userId && !localStorage.getItem('hasAgreedTerms_' + userId)) {
          this.router.navigate(['/onboarding']);
        } else {
          this.router.navigate(['/tabs/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login Error:', err);
        const errorMsg = err.error?.message || 'Email atau password salah';
        this.presentToast(errorMsg, 'danger', 'alert-circle-outline');
      }
    });
  }

  async presentToast(message: string, color: string = 'dark', icon: string = '') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'zeven-toast',
      buttons: [
        {
          side: 'start',
          icon: icon,
          handler: () => { }
        }
      ]
    });
    toast.present();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

@Component({
  selector: 'app-register',
  template: `
    <ion-content class="zeven-bg">
      <div class="auth-header">
        <ion-buttons slot="start" style="margin-bottom: 20px; margin-left: -10px;">
          <ion-button (click)="goBack()">
            <ion-icon name="arrow-back-outline" slot="icon-only" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <h1 class="zeven-heading">Buat Akun</h1>
        <p class="zeven-subheading">Bergabung dengan marketplace Zeven hari ini</p>
      </div>

      <div class="auth-form ion-padding">
        <ion-item lines="none" class="zeven-input">
          <ion-icon name="person-outline" slot="start" color="medium"></ion-icon>
          <ion-input type="text" placeholder="Nama Lengkap" [(ngModel)]="name"></ion-input>
        </ion-item>

        <ion-item lines="none" class="zeven-input">
          <ion-icon name="mail-outline" slot="start" color="medium"></ion-icon>
          <ion-input type="email" placeholder="Alamat Email" [(ngModel)]="email"></ion-input>
        </ion-item>

        <ion-item lines="none" class="zeven-input">
          <ion-icon name="lock-closed-outline" slot="start" color="medium"></ion-icon>
          <ion-input type="password" placeholder="Kata Sandi" [(ngModel)]="password"></ion-input>
        </ion-item>

        <ion-item lines="none" class="zeven-input">
          <ion-icon name="shield-checkmark-outline" slot="start" color="medium"></ion-icon>
          <ion-input type="password" placeholder="Konfirmasi Kata Sandi" [(ngModel)]="confirmPassword"></ion-input>
        </ion-item>

        <ion-button expand="block" class="zeven-gradient-btn ion-margin-top" (click)="register()" [disabled]="isLoading">
          <ion-spinner name="crescent" *ngIf="isLoading" slot="start"></ion-spinner>
          Buat Akun
        </ion-button>

        <div class="register-link">
          Sudah punya akun? <a (click)="goBack()">Masuk</a>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-header {
      padding: 40px 24px 30px;
    }
    .register-link {
      text-align: center;
      margin-top: 40px;
      color: var(--ion-color-medium);
      font-size: 14px;
    }
    .register-link a {
      color: var(--ion-color-primary);
      font-weight: 600;
      cursor: pointer;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  async register() {
    if (!this.name || !this.email || !this.password) {
      this.presentToast('Harap isi semua kolom', 'warning', 'information-circle-outline');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.presentToast('Konfirmasi kata sandi tidak cocok', 'warning', 'lock-open-outline');
      return;
    }

    this.isLoading = true;
    this.authService.registerBuyer(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.presentToast('Pendaftaran Berhasil! Silakan masuk.', 'success', 'person-add-outline');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Register Error:', err);
        const errorMsg = err.error?.message || 'Pendaftaran gagal. Pastikan email belum terdaftar.';
        this.presentToast(errorMsg, 'danger', 'close-circle-outline');
      }
    });
  }

  async presentToast(message: string, color: string = 'dark', icon: string = '') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'zeven-toast',
      buttons: [
        {
          side: 'start',
          icon: icon,
          handler: () => { }
        }
      ]
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
