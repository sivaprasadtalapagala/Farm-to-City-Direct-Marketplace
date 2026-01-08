import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../services/order.service';

// import { CartService } from '../../../core/services/cart.service';
// import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  cartItems = this.cartService.cartItems;
  totalAmount = this.cartService.totalAmount;

  loading = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  placeOrder() {
    this.loading = true;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    const payload = {
      deliveryDate,
      items: this.cartItems().map((item: any) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
