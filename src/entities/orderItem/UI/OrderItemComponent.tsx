import { Order } from '@/entities/order/model/types';

import styles from './OrderItem.module.scss';

interface OrderItemProps {
    order: Order;
}

const OrderItemComponent = ({ order }: OrderItemProps) => {
    return (
        <article className={styles.OrderItemCard}>
            <h4 className={styles.title}>Что в заказе</h4>

            <ul className={styles.orderItemList}>
                {order.OrderItems.map((orderItem, index) => (
                    <li key={index} className={styles.orderItem}>
                        <span>{orderItem.itemName}</span>
                        <span>{orderItem.itemPrice}</span>
                        <span>{orderItem.calories}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
};

export default OrderItemComponent;
