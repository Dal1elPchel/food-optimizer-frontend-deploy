import { OrderItem } from '@/entities/orderItem/model/types';

export interface Order {
    id: string;
    name: string;
    totalPrice: number;
    totalCalories: number;
    restaurantName: string;
    OrderItems: OrderItem[];
}
