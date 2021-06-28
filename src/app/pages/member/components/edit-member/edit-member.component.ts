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
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent implements OnInit {
  uuid: string = '';
  form: FormGroup;
  showModal: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  hasSubmitted: boolean = false;
  HELP_TEXT: string = '此欄位為必填欄位';
  profileSnapshot = new MemberAccount();

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
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        [this.validateEmail.bind(this)]
      ),
      contactMobileTel: new FormControl(null),
      cardNo: new FormControl(null),
    });

    this.memberService
      .getMemberById(this.uuid)
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data) => this.bindData(data));
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
    this.isDeleting = false;
    this.onAlertOk = () => {
      this.showModal = false;
      this.onGoBack();
    };

    this.hasSubmitted = true;
    if (!this.form.valid) {
      return;
    }
    const updateData = { ...this.profileSnapshot, ...this.form.value };

    this.memberService.updateMember(updateData).subscribe((data) => {
      this.showAlert();
    });
  }

  onDelete() {
    this.isDeleting = true;
    this.onAlertOk = () => {
      this.showModal = false;
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

  showAlert() {
    this.showModal = true;
  }

  onGoBack() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
