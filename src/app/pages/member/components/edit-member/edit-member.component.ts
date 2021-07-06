import { Observable, Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent implements OnInit, OnDestroy {
  HELP_TEXT: string = '此欄位為必填欄位';
  EDIT_COMPLETED_TEXT: string = '編輯完成';
  CONFIRM_DELETE_TEXT: string = '是否確認刪除?';

  uuid: string = '';
  form: FormGroup;
  showModal: boolean = false;
  isLoading: boolean = false;
  hasCancelBtn: boolean = false;
  hasSubmitted: boolean = false;
  alertText: string;
  profileSnapshot = new MemberAccount();
  memberServiceSubscription: Subscription;

  onAlertOk: () => void;
  onAlertCancel: () => void;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.uuid = this.route.snapshot.params['id'];

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.validateEmail.bind(this)],
        updateOn: 'blur',
      }),
      contactMobileTel: new FormControl(null),
      cardNo: new FormControl(null),
    });

    this.memberServiceSubscription = this.memberService
      .getMemberById(this.uuid)
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data) => this.bindData(data));
  }

  ngOnDestroy(): void {
    if (this.memberServiceSubscription) {
      this.memberServiceSubscription.unsubscribe();
    }
  }

  bindData(data: MemberAccount) {
    this.profileSnapshot = data;
    this.form.patchValue({ ...data });
  }

  validateEmail(control: AbstractControl): Observable<any> | null {
    if (!control.touched || control.value === this.profileSnapshot.email) {
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
    return this.HELP_TEXT;
  }
  onSubmit() {
    // config alert modal
    this.hasCancelBtn = false; // we don't need cancel btn when edit accomplishes
    this.setAlertText(this.EDIT_COMPLETED_TEXT);
    this.onAlertOk = () => {
      this.closeAlert();
      this.onGoBack();
    };

    this.hasSubmitted = true; // flag form as submitted

    if (!this.form.valid) {
      return;
    }
    const updateData = { ...this.profileSnapshot, ...this.form.value };

    this.memberService.updateMember(updateData).subscribe((data) => {
      this.showAlert();
    });
  }

  onDelete() {
    // config alert modal
    this.hasCancelBtn = true;
    this.setAlertText(this.CONFIRM_DELETE_TEXT);

    // set callback
    this.onAlertOk = () => {
      this.closeAlert();
      this.memberService.deleteMember(this.uuid).subscribe(
        (data) => {
          console.log(data);
          this.onGoBack();
        },
        (err) => {
          // error popup
          alert('刪除失敗');
        }
      );
    };
    this.onAlertCancel = () => {
      this.showModal = false;
    };
    this.showAlert();
  }

  onGoBack() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  showAlert() {
    this.showModal = true;
  }

  closeAlert() {
    this.showModal = false;
  }

  setAlertText(text: string) {
    this.alertText = text;
  }
}
