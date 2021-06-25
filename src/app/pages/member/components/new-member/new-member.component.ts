import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      account: new FormControl(null, Validators.required),
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
    this.hasSubmitted = true;
    if (this.form.status === 'VALID') {
      this.memberService.createMember(this.form.value).subscribe(
        (data) => {
          this.showModal = true;
        },
        (error) => {
          this.resultText = '新增失敗';
        }
      );
    }
  }

  onGoBack() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  onAlertOk() {
    this.showModal = false;
    this.onGoBack();
  }

  isShowHelp(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !control.valid && (control.touched || this.hasSubmitted);
  }

  getEmailError() {
    const emailErrors = this.form.get('email').errors;
    if (emailErrors?.existed) {
      return '此Email已被使用';
    }
    if (emailErrors?.email) {
      return 'Email格式不符';
    }
    return null;
  }

  validateEmail(control: AbstractControl): Observable<any> | null {
    if (!control.touched || control.value === '') {
      return of(null);
    }
    const queryObj = new MemberAccount();
    queryObj.email = control.value.trim();
    return this.memberService.getMemberList(queryObj, null).pipe(
      switchMap((data) => {
        if (data.resultList.length > 0) {
          return of({ existed: true });
        }
        return of(null);
      })
    );
  }
}
