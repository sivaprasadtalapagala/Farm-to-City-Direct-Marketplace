export interface OrderItem {
  name: string;
  quantity: number;
  pricePerKg: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered';
  deliveryDate: string;
  createdAt: string;
}
