import { IonicModule, ToastController } from '@ionic/angular';
import { Component, ViewChild, inject, signal, viewChild } from '@angular/core';
import {
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
} from 'ngx-scanner-qrcode';
import { Auth } from '../../auth/services/auth';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.scss'],
  standalone: true,
  imports: [IonicModule, NgxScannerQrcodeComponent],
})
export class LectorQrComponent {
  // ====== INYECCIONES ======
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastController);

  public scanResult = signal<string | null>(null);

  public scanner = viewChild(NgxScannerQrcodeComponent);

  public logout() {
    this._auth.logout();
    this._router.navigateByUrl('/login');
  }

  ngOnInit() {
    addIcons({
      'log-out-outline': logOutOutline,
    });
  }

  ionViewWillEnter() {
    const scanInstance = this.scanner();
    if (scanInstance) {
      scanInstance.start();
    }
  }

  ionViewWillLeave() {
    const scanInstance = this.scanner();
    if (scanInstance) {
      scanInstance.stop();
    }
  }

  public scanSuccess(event: any) {
    this.scanResult.set(event);
  }
}
