
import { Injectable } from '@angular/core';
import { AuthToken } from 'src/app/shared/models/auth-token.model';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {

  private authToken?: AuthToken;
  constructor() { }

  set token(token: AuthToken) {
    this.authToken = token;
    sessionStorage.setItem('authToken', JSON.stringify(this.authToken));
  }

  get token(): AuthToken {
    return this.authToken || JSON.parse(sessionStorage.getItem('authToken'));
  }

  get logonUserId(): string {
    this.authToken = this.authToken || JSON.parse(sessionStorage.getItem('authToken'));
    return this.authToken?.uuid || '';
  }

  generateToken(authToken: string, uuid: string): void {
    if (!authToken || !uuid) {
      throw Error('AuthToken or UUID cannot be empty.');
    }
    const token = { authToken, uuid, success: 'true' }
    this.token = token;
  }
}
