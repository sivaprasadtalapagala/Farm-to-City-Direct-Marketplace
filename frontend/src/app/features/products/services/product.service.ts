import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(this.baseUrl);
  }
}
