import { IonicModule } from '@ionic/angular';
import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  public loginForm = this._formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(3)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {}

  public login() {
    const { email, password } = this.loginForm.value;

    if (!email && !password) return;

    this._auth.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) this._router.navigateByUrl('/');
    });
  }
}
