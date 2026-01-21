import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getMyOrders() {
    return this.http.get<Order[]>(`${this.baseUrl}/my`);
  }
}
