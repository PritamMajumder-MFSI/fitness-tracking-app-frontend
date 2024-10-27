import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../components/layout/auth-layout/auth-layout.component';
import { lastValueFrom } from 'rxjs';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signUpForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _backendService: BackendService
  ) {
    this.signUpForm = this._fb.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  public async login() {
    if (this.signUpForm.invalid) {
      return;
    }
    const response = await lastValueFrom(
      this._backendService.postApiCall<any, any>(
        '/auth/signup',
        this.signUpForm.value
      )
    );
    console.log(response);
  }
}
