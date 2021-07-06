import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthTokenService } from './auth-token.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(
    private http: HttpClient,
    private tokenService: AuthTokenService
  ) {}

  httpGet<T>(
    url: string,
    queryParam?: any,
    hasHeader: boolean = true
  ): Observable<T> {
    return this.http
      .get<T>(url, {
        headers: hasHeader ? this.getRequestHeaders() : new HttpHeaders(),
        params: this.getRequestParams(queryParam),
      })
      .pipe(retry(1));
  }

  httpPut<T>(url: string, payload: any, contentType?: any) {
    if (!contentType) {
      contentType = 'application/json';
    }

    return this.http.put<T>(url, this.getRequestPayload(payload, contentType), {
      headers: this.getRequestHeaders(contentType),
    });
  }

  httpPost<T>(url: string, payload: any, contentType?: any) {
    if (!contentType) {
      contentType = 'application/json';
    }

    return this.http.post<T>(
      url,
      this.getRequestPayload(payload, contentType),
      {
        headers: this.getRequestHeaders(contentType),
      }
    );
  }

  httpDelete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.getRequestHeaders(),
    });
  }

  /**
   * 預設Content-Type為application/json
   * @param contentType 資料格式
   */
  private getRequestHeaders(contentType?: string) {
    console.log(this.tokenService.token?.authToken);
    return new HttpHeaders({
      'Content-Type': contentType || 'application/json',
      authToken: this.tokenService.token?.authToken || '',
    });
  }

  private getRequestPayload(
    payload: any,
    contentType: string = 'application/json'
  ) {
    switch (contentType) {
      case 'application/json':
        return payload;
      case 'application/x-www-form-urlencoded':
        return this.getRequestParams(payload);
    }
    return payload;
  }

  private getRequestParams(payload: any) {
    let body = new HttpParams();
    if (!payload) {
      return body;
    }
    for (const key of Object.keys(payload)) {
      if (payload[key]) {
        body = body.set(key, payload[key]);
      }
    }
    return body;
  }
}
