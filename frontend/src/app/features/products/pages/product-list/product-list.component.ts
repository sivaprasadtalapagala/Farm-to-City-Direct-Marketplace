import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { getProductImage } from '../../utils/product-image.util';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService, private cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("products::",this.products)
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getImage(product: Product): string {
    return getProductImage(product.category);
  }

  trackById(_: number, item: Product) {
    return item._id;
  }

  addToCart(product: Product): void {
  this.cartService.addToCart(product);
}
}
