import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AuthTokenService } from '../../services/auth-token.service';
import { Credential } from '../../../shared/models/credential.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFormGroup: FormGroup = new FormGroup({
    account: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  allowSubmit = false;
  error: Error = null;
  httpSubscription: Subscription = null;
  stateSubscription: Subscription = null;

  @ViewChild('passwordInput') passwordRef: ElementRef;

  constructor(
    private authService: AuthService,
    private tokenService: AuthTokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenService.token) {
      this.navigateAway();
    }

    this.stateSubscription = this.loginFormGroup.statusChanges.subscribe(
      (status) => {
        if (status === 'VALID') {
          this.allowSubmit = true;
        } else {
          this.allowSubmit = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    // clear subscriptions
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  submitForm() {
    const userData: Credential = {
      account: this.loginFormGroup.get('account').value,
      password: this.loginFormGroup.get('password').value,
    };
    // prevent submissions
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    // send http request
    this.httpSubscription = this.authService.authentication(userData).subscribe(
      (data) => {
        this.error = null;
        this.navigateAway();
      },
      (error) => (this.error = new Error('登入失敗，請檢查您的帳號或密碼。'))
    );
  }

  toggleType() {
    const currentType = this.passwordRef.nativeElement.type;
    this.passwordRef.nativeElement.type =
      currentType === 'password' ? 'text' : 'password';
  }

  navigateAway() {
    this.router.navigate(['/pages', 'member']);
  }
}
