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
  isSending: boolean = false;
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
    // can use this.loginFormGroup.valid directly since no async validation is applied
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
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  submitForm() {
    if (this.isSending) {
      return;
    }
    const userData: Credential = {
      account: this.loginFormGroup.get('account').value,
      password: this.loginFormGroup.get('password').value,
    };
    // prevent multiple clicks
    this.isSending = true;
    this.authService.authentication(userData).subscribe(
      (data) => {
        this.error = null;
        this.isSending = false;
        this.navigateAway();
      },
      (error) => {
        this.error = new Error('????????????????????????????????????????????????');
        this.isSending = false;
      }
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
