import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { MemberService } from './../../services/member.service';
import { MemberAccount } from 'src/app/shared/models/member-account.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent implements OnInit {
  uuid: string = '';
  form: FormGroup;
  HELP_TEXT: string = '此欄位為必填欄位';
  emailHelpText: string;
  profileSnapshot = new MemberAccount();

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['id'];

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        [this.validateEmail.bind(this)]
      ),
      contactPhone: new FormControl(null),
      cardNo: new FormControl(null),
    });

    this.memberService
      .getMemberById(this.uuid)
      .subscribe((data) => this.bindData(data));
  }

  bindData(data: MemberAccount) {
    this.profileSnapshot = data;
    this.form.get('name').setValue(data.name);
    this.form.get('status').setValue(data.status);
    this.form.get('email').setValue(data.email);
    this.form.get('contactPhone').setValue(null);
    this.form.get('cardNo').setValue(data.cardNo);
  }

  validateEmail(control: AbstractControl): Observable<any> | null {
    if (!control.touched) {
      return of(null);
    }
    const queryObj = new MemberAccount();
    queryObj.email = control.value.trim();
    return this.memberService.getMemberList(queryObj, null).pipe(
      switchMap((data) => {
        if (data.resultList.length > 0) {
          this.emailHelpText = '此Email已被使用';
          return of({ existed: true });
        }
        return of(null);
      })
    );
  }

  isShowHelp(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !control.valid && control.touched;
  }

  getEmailError() {
    const emailErrors = this.form.get('email').errors;
    if (emailErrors?.existed) {
      return '此Email已被使用';
    }
    if (emailErrors?.email) {
      return 'Email格式不符';
    }
    return this.HELP_TEXT;
  }
  onSubmit() {
    if (!this.form.valid) {
      alert('無法提交');
      return;
    }
    const updateData = { ...this.profileSnapshot, ...this.form.value };

    this.memberService.updateMember(updateData).subscribe((data) => {
      console.log(data);
    });
  }

  onGoBack() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
