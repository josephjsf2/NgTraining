import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { EditMemberComponent } from '../edit-member/edit-member.component';
import { PasswordValidator } from 'src/app/shared/helpers/Validation';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  uuid: string = '';
  showAlert: boolean = false;
  HELP_TEXT = '此欄位為必填欄位';
  resultText = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(PasswordValidator),
      ]),
      password2: new FormControl(
        null,
        [Validators.required],
        [this.validatePassword2.bind(this)]
      ),
    });

    this.getParamFromRoot().subscribe((params) => {
      this.uuid = params['id'];
    });
  }

  getParamFromRoot(): Observable<Params> {
    // get root params
    const root = this.route.pathFromRoot.filter(
      (r) => r.component === EditMemberComponent
    );

    if (root.length > 0) {
      return root[0].params;
    } else {
      this.goBack();
      return null;
    }
  }

  validatePassword2(control: AbstractControl): Observable<ValidationErrors> {
    if (control.value === this.form.get('password').value) {
      return of(null);
    }
    return of({ mismatch: true });
  }

  onSubmit() {
    this.form.get('password').updateValueAndValidity();
    this.form.get('password2').updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }
    this.memberService
      .resetPassword(this.uuid, this.form.get('password').value)
      .subscribe(
        (data) => {
          console.log(data);
          this.showAlert = true;
        },
        (err) => {
          console.log(err);
          this.resultText = '變更密碼失敗';
        }
      );
  }

  goBack() {
    this.router.navigate(['../']);
  }

  getPasswordError() {
    const errors = this.form.get('password').errors;
    if (errors?.pattern) {
      return '密碼格式不正確';
    }
    if (errors?.required) {
      return this.HELP_TEXT;
    }
    return '';
  }

  getPassword2Error() {
    const errors = this.form.get('password2').errors;
    if (errors?.mismatch) {
      return '兩次輸入不相同';
    }
    if (errors?.required) {
      return this.HELP_TEXT;
    }
    return '';
  }

  closeAlert() {
    this.showAlert = false;
  }
}
