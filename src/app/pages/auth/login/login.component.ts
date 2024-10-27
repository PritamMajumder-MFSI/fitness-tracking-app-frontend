import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../../../components/layout/auth-layout/auth-layout.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginFormGroup: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _backendService: BackendService
  ) {
    this.loginFormGroup = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public async login() {
    if (this.loginFormGroup.invalid) {
      return;
    }
    const response = await lastValueFrom(
      this._backendService.postApiCall<any, any>(
        '/auth/login',
        this.loginFormGroup.value
      )
    );
    console.log(response);
  }
}
