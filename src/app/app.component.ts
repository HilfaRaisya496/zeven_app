import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private location: Location,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Mengubah warna Status Bar HP (Baterai, Jam) menjadi hijau khas Zeven
      if (this.platform.is('capacitor')) {
        try {
          await StatusBar.setBackgroundColor({ color: '#114232' });
          await StatusBar.setStyle({ style: Style.Dark });
        } catch (e) {
          console.warn('StatusBar plugin not available', e);
        }
      }
      this.setupBackButtonBehavior();
    });
  }

  setupBackButtonBehavior() {
    this.platform.backButton.subscribeWithPriority(10, async (processNextHandler) => {
      const currentUrl = this.router.url;
      
      // Jika berada di tab utama atau halaman login
      if (currentUrl === '/tabs/home' || currentUrl === '/tabs/history' || currentUrl === '/tabs/profile' || currentUrl === '/login' || currentUrl === '/') {
        const alert = await this.alertController.create({
          header: 'Keluar Aplikasi?',
          message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
          buttons: [
            { text: 'Batal', role: 'cancel' },
            { 
              text: 'Keluar', 
              role: 'confirm',
              handler: () => { App.exitApp(); }
            }
          ]
        });
        await alert.present();
      } else {
        // Kembali ke halaman sebelumnya
        this.location.back();
      }
    });
  }
}
