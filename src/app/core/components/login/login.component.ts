import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormGroup: FormGroup = new FormGroup({
    account: new FormControl(),
    password: new FormControl()
  });

  constructor(private authService: AuthService) { }

  submitForm() {
    // this.authService.authentication
  }
}
