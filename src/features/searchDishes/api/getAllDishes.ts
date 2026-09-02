import { Order } from '@/entities/order/model/types';
import httpClient from '@/shared/api/httpClient';

export const getAllDishes = async (data: object): Promise<Order[]> => {
    return await httpClient.post<Order[]>('Orders/optimize', data);
};
