import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../../core/services/cart.service';
import { RouterModule } from '@angular/router';

// import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  cartItems = this.cartService.cartItems;
  totalAmount = this.cartService.totalAmount;

  constructor(private cartService: CartService) {}

  increase(id: string) {
    this.cartService.increaseQty(id);
  }

  decrease(id: string) {
    this.cartService.decreaseQty(id);
  }
}
