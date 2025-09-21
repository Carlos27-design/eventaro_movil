import { Component, inject, viewChild } from '@angular/core';
import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
import { IonicModule, ToastController } from '@ionic/angular';
import { Auth } from '../../auth/services/auth';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { Inscription } from '../services/inscription';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.scss'],
  standalone: true,
  imports: [IonicModule, NgxScannerQrcodeComponent],
})
export class LectorQrComponent {
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);
  private readonly _inscription = inject(Inscription);
  private readonly _toast = inject(ToastController);

  // ViewChild como signal
  public scanner = viewChild(NgxScannerQrcodeComponent);

  ngOnInit() {
    addIcons({ 'log-out-outline': logOutOutline });
  }

  public logout() {
    this._auth.logout();
    this._router.navigateByUrl('/login');
  }

  ionViewWillEnter() {
    const scan = this.scanner();
    if (scan) {
      scan.start();

      // Suscribirse a jdata
      scan.data.subscribe((results: ScannerQRCodeResult[]) => {
        if (results.length > 0) {
          const qrValue = results[0].value; // aquí está tu QR
          this.handleQR(qrValue);
        }
      });
    }
  }

  ionViewWillLeave() {
    this.scanner()?.stop();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  private async handleQR(qrValue: any) {
    try {
      const inscription = await this._inscription
        .acceptInscription(qrValue)
        .toPromise();
      const toast = await this._toast.create({
        message: `Inscripción Aceptada: ${inscription.event.name}`,
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    } catch (err: any) {
      const toast = await this._toast.create({
        message: `Error: ${err.message || 'No se pudo aceptar'}`,
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
  }
}
