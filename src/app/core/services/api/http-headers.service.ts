import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpHeaderService {
  private accessToken: string;

  constructor() {
    this.accessToken = localStorage.getItem('AppAccessToken') || '';
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });
  }
}
