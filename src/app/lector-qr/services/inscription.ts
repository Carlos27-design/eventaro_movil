import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inscriptions } from '../interfaces/inscription.interface';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class Inscription {
  private readonly _http = inject(HttpClient);

  public acceptInscription(token: string): Observable<any> {
    return this._http.patch<any>(`${URL}/inscription/accept`, { token });
  }
}
