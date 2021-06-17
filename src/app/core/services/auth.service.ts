import { MemberAccount } from '../../shared/models/member-account.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { AuthToken } from 'src/app/shared/models/auth-token.model';

import { AuthTokenService } from './auth-token.service';
import { RestService } from './rest.service';
import { Credential } from '../../shared/models/credential.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  static BASE_AUTH_URL = '/rest';
  static AUTHENTICATION_URL = `${AuthService.BASE_AUTH_URL}/auth/admin/authentication`;
  static USER_PROFILE_URL = `${AuthService.BASE_AUTH_URL}/member/user/accounts/myProfile`;

  userProfile: MemberAccount;

  constructor(
    private restService: RestService,
    private tokenService: AuthTokenService) {
  }

  /**
   * 登入認證
   * @param credential 登入認證資訊
   */
  authentication(credential: Credential): Observable<any> {
    return this.restService.httpPost<AuthToken>(AuthService.AUTHENTICATION_URL, credential, 'application/x-www-form-urlencoded')
      .pipe(
        tap(resp => {
          if (resp.success) {
            this.tokenService.token = resp;
          }
        }),
        switchMap(() => this.getUserProfile())
      );
  }

  /**
   * 使用者登出
   * 清除 userProfile, token, sessionStorage
   * @URL DELETE  /rest/auth/admin/authentication
   */
  userLogout(): Observable<ApiResponse> {
    this.userProfile = null;
    sessionStorage.clear();
    this.tokenService.token = null;
    return this.restService.httpDelete(AuthService.AUTHENTICATION_URL);
  }

  /**
   * 重新抓取使用者 profile
   */
  getUserProfile(forceUpdate?: boolean): Observable<MemberAccount> {

    if (!forceUpdate) {
      if (this.userProfile) {
        return of(this.userProfile);
      }

      if (sessionStorage.getItem('userProfile')) {
        try {
          this.userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
          return of(this.userProfile);
        } catch (err) {
          console.log('Parse profile error.', err);
        }
      }
    }

    return this.restService.httpGet<MemberAccount>(AuthService.USER_PROFILE_URL)
      .pipe(
        tap((profile: MemberAccount) => this.userProfile = profile),
        tap(profile => sessionStorage.setItem('userProfile', JSON.stringify(profile)))
      );
  }

}
