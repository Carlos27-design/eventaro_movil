import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

type AuthStatus = 'checking' | 'not-authenticated' | 'authenticated';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token')!);

  private readonly _http = inject(HttpClient);

  public checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  public authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  public user = computed(() => this._user());
  public token = computed(() => this._token());

  public isAdmin = computed(
    () => this._user()?.roles.includes('ADMIN') ?? false
  );

  public isOrganizer = computed(
    () => this._user()?.roles.includes('ORGANIZER') ?? false
  );

  public isUser = computed(() => this._user()?.roles.includes('USER') ?? false);

  public checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this._authStatus.set('not-authenticated');
      return of(false);
    }

    return this._http.get<AuthResponse>(`${URL}/auth/check-status`).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  public login(email: string, password: string): Observable<boolean> {
    return this._http
      .post<AuthResponse>(`${URL}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  public logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
