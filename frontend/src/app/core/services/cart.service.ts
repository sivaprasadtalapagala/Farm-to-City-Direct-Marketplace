import {
  Injectable,
  signal,
  computed,
  effect,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CartItem } from '../models/cart.model';
import { Product } from '../../features/products/models/product.model';

const CART_KEY = 'farm_to_city_cart';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly isBrowser: boolean;

  private readonly _cart = signal<CartItem[]>([]);

  cartItems = computed(() => this._cart());

  totalAmount = computed(() =>
    this._cart().reduce((sum, item) => sum + item.totalPrice, 0)
  );

  totalItems = computed(() =>
    this._cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Load cart ONLY in browser
    if (this.isBrowser) {
      this._cart.set(this.loadFromStorage());
    }

    // Persist cart ONLY in browser
    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(
          CART_KEY,
          JSON.stringify(this._cart())
        );
      }
    });
  }

  addToCart(product: Product): void {
    const cart = [...this._cart()];
    const existing = cart.find(
      i => i.product._id === product._id
    );

    if (existing) {
      existing.quantity += 1;
      existing.totalPrice =
        existing.quantity * product.pricePerKg;
    } else {
      cart.push({
        product,
        quantity: 1,
        totalPrice: product.pricePerKg
      });
    }

    this._cart.set(cart);
  }

  increaseQty(productId: string): void {
    this.updateQty(productId, 1);
  }

  decreaseQty(productId: string): void {
    this.updateQty(productId, -1);
  }

  clearCart(): void {
    this._cart.set([]);
  }

  private updateQty(productId: string, delta: number): void {
    const cart = [...this._cart()];
    const item = cart.find(
      i => i.product._id === productId
    );

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
      this._cart.set(
        cart.filter(i => i.product._id !== productId)
      );
      return;
    }

    item.totalPrice =
      item.quantity * item.product.pricePerKg;

    this._cart.set(cart);
  }

  private loadFromStorage(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
