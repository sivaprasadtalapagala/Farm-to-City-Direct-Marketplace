import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(payload: any) {
    return this.http.post(this.baseUrl, payload);
  }
}
