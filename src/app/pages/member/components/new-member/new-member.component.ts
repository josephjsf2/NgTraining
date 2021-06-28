import { ApiResponse } from './../../../../shared/models/api-response.model';
import { PasswordValidator } from './../../../../shared/helpers/Validation';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, debounceTime } from 'rxjs/operators';
import { MemberAccount } from 'src/app/shared/models/member-account.model';

import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss'],
})
export class NewMemberComponent implements OnInit {
  form: FormGroup;
  showModal: boolean = false;
  isLoading: boolean = false;
  hasSubmitted: boolean = false;
  HELP_TEXT: string = '此欄位為必填欄位';
  resultText: string = '';
  modalOkCallback: () => void;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      account: new FormControl(null, Validators.required, [
        this.validateAccount.bind(this),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(PasswordValidator),
      ]),
      name: new FormControl(null, Validators.required),
      status: new FormControl('', Validators.required),
      email: new FormControl(
        null,
        [Validators.email],
        [this.validateEmail.bind(this)]
      ),
      contactMobileTel: new FormControl(null),
      cardNo: new FormControl(null),
    });
  }

  onSubmit() {
    this.hasSubmitted = true; // submit btn touch flag
    if (this.form.status !== 'VALID') {
      return;
    }
    this.memberService
      .createMember(this.form.value)
      .pipe(
        switchMap((data) =>
          this.memberService.resetPassword(
            data.uuid,
            this.form.get('password').value
          )
        ),
        catchError(this.submitErrorHandler)
      )
      .subscribe((data) => {
        console.log(data);
        if (data?.code !== '200') {
          this.resultText = data?.message;
          return;
        }
        this.resultText = '';
        this.modalOkCallback = () => {
          this.showModal = false;
          this.onGoBack();
        };
        this.alert();
      });
  }

  onGoBack() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  alert() {
    this.showModal = true;
  }

  isShowHelp(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !control.valid && (control.touched || this.hasSubmitted);
  }

  getEmailError() {
    const errors = this.form.get('email').errors;
    if (errors?.existed) {
      return '此Email已被使用';
    }
    if (errors?.email) {
      return 'Email格式不符';
    }
    if (errors?.required) {
      return this.HELP_TEXT;
    }
    return '';
  }

  getPasswordError() {
    const errors = this.form.get('password').errors;
    if (errors?.pattern) {
      return '密碼格式不符';
    }
    if (errors?.required) {
      return this.HELP_TEXT;
    }
    return '';
  }

  getAccountError() {
    const errors = this.form.get('account').errors;
    if (errors?.existed) {
      return '此帳號已被使用';
    }
    if (errors?.required) {
      return this.HELP_TEXT;
    }
    return '';
  }

  // Check existed email
  validateEmail(control: AbstractControl): Observable<any> | null {
    if (!control.touched || control.value === '') {
      return of(null);
    }
    const queryObj = new MemberAccount();
    queryObj.email = control.value.trim();

    return this.memberService.getMemberList(queryObj, null).pipe(
      switchMap((data) => {
        if (
          data.resultList &&
          data.resultList.length > 0 &&
          data.resultList.filter((item) => item.email === queryObj.email)
            .length > 0
        ) {
          return of({ existed: true });
        }
        return of(null);
      })
    );
  }

  // Check existed account
  validateAccount(control: AbstractControl): Observable<any> | null {
    if (!control.touched || control.value === '') {
      return of(null);
    }
    const queryObj = new MemberAccount();
    queryObj.account = control.value.trim();

    return this.memberService.getMemberList(queryObj, null).pipe(
      switchMap((data) => {
        if (
          data.resultList &&
          data.resultList.length > 0 &&
          data.resultList.filter((item) => item.account === queryObj.account)
            .length > 0
        ) {
          return of({ existed: true });
        }
        return of(null);
      })
    );
  }

  // Handle submit errors
  submitErrorHandler(err: any): Observable<ApiResponse> {
    if (err.status === 'Y') {
      return of({
        code: '200',
        message: '人員新增成功',
        status: 'Y',
      });
    }
    if (err.status === 401) {
      return of({
        code: '401',
        message: '身分驗證失敗',
        status: '0',
      });
    }
    return of({
      code: err.error.code,
      message: err.error.message,
      status: err.error.status,
    });
  }
}
