import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

// import { OrderService } from '../services/order.service';
// import { Order } from '../models/or/der.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getDeliveryBadge(date: string): string {
    const delivery = new Date(date);
    const today = new Date();

    const diff =
      (delivery.setHours(0,0,0,0) - today.setHours(0,0,0,0)) /
      (1000 * 60 * 60 * 24);

    if (diff === 0) return 'Arriving Today';
    if (diff === 1) return 'Arriving Tomorrow';
    return 'Scheduled';
  }
}
