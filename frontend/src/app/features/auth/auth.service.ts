import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService) {}

  register(payload: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }) {
    return this.api.post('/api/auth/register', payload);
  }

  login(payload: {
    email: string;
    password: string;
  }) {
    return this.api.post('/api/auth/login', payload);
  }
}
