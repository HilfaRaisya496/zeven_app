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
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/onboarding']);
    }, 2500);
  }
}

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="zeven-bg">
      <div class="onboarding-container">
        <div class="illustration">
          <div class="circle-bg"></div>
          <ion-icon name="cart-outline" class="main-icon"></ion-icon>
        </div>
        <div class="text-content">
          <h1 class="zeven-heading">Temukan & Belanja</h1>
          <p>Rasakan era baru social commerce. Terhubung dengan penjual, tonton siaran langsung, dan beli produk premium dengan mudah.</p>
        </div>
        
        <div class="actions">
          <div class="dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <ion-button expand="block" class="zeven-gradient-btn" (click)="getStarted()">
            Mulai
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .onboarding-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 40px 24px;
      justify-content: space-between;
    }
    .illustration {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
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
      margin-bottom: 40px;
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
      margin-bottom: 20px;
    }
    .dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 32px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: var(--ion-color-medium);
      opacity: 0.3;
      transition: all 0.3s;
    }
    .dot.active {
      width: 24px;
      opacity: 1;
      background: var(--ion-color-secondary);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingPage {
  constructor(private router: Router) { }
  getStarted() {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    this.router.navigate(['/login']);
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
          <a>Lupa Kata Sandi?</a>
        </div>

        <ion-button expand="block" class="zeven-gradient-btn ion-margin-top" (click)="login()" [disabled]="isLoading">
          <ion-spinner name="crescent" *ngIf="isLoading" slot="start"></ion-spinner>
          Masuk
        </ion-button>

        <div class="divider">
          <span>ATAU</span>
        </div>

        <div class="social-login">
          <ion-button fill="outline" color="dark" class="social-btn">
            <ion-icon name="logo-google" slot="start"></ion-icon>
            Google
          </ion-button>
        </div>

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
        this.router.navigate(['/tabs/home']);
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
