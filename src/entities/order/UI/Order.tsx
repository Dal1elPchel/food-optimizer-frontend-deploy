import React from 'react';

import { Order } from '@/entities/order/model/types';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth';
import LikeBtn from '@/shared/UI/likeBtn/likeBtn';

import styles from './OrderStyles.module.scss';

interface OrderProps {
    isCurrentOrder: boolean;
    orderInfo: Order;
    onClick: (id: string) => void;
}

const OrderComponent = ({ isCurrentOrder, orderInfo, onClick }: OrderProps) => {
    const width = useWindowWidth();

    return (
        <div
            onClick={() => {
                onClick(orderInfo.id);
            }}
            className={`${styles.orderCard} ${isCurrentOrder ? styles.activeCard : ''}`}
        >
            <div className={`${styles.orderNumber} ${isCurrentOrder ? styles.activeNumber : ''}`}>
                {orderInfo.id}
            </div>
            <div className={styles.additionalInfo}>
                <h3>{orderInfo.name}</h3>
                <p>Каллорийность: {orderInfo.totalCalories}</p>
            </div>
            {width > 1100 && <div className={styles.totalPrice}>{orderInfo.totalPrice} $</div>}

            <span className={styles.likeBtnContainer}>
                <LikeBtn />
            </span>
            {width < 1100 && <div className={styles.totalPrice}>{orderInfo.totalPrice} $</div>}
        </div>
    );
};

export default OrderComponent;
