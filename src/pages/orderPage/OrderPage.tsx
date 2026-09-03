import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Order } from '@/entities/order/model/types';
import OrderComponent from '@/entities/order/UI/Order';
import { dishesQueryParams } from '@/features/searchDishes/api/queryParams';
import { PreferencesToAPI } from '@/features/searchDishes/lib/PreferencesToAPI';
import { useFilterStore } from '@/features/searchFilters/model/search.store';
import BackBtn from '@/shared/UI/backBtn/backBtn';

import styles from './OrderPage.module.scss';
const mockOrders: Order[] = [
    {
        id: '1',
        name: 'Ужин с друзьями',
        totalPrice: 3290,
        totalCalories: 4120,
        restaurantName: 'Burger House',
        OrderItems: [
            {
                itemName: 'Двойной чизбургер',
                itemPrice: 890,
                calories: 1150,
                discountType: null,
                efficientItemPrice: 890,
                manual: '',
            },
            {
                itemName: 'Картофель фри большой',
                itemPrice: 490,
                calories: 620,
                discountType: 1,
                efficientItemPrice: 390,
                manual: '',
            },
            {
                itemName: 'Милкшейк шоколадный',
                itemPrice: 610,
                calories: 780,
                discountType: null,
                efficientItemPrice: 610,
                manual: '',
            },
            {
                itemName: 'Наггетсы 12 шт',
                itemPrice: 1300,
                calories: 1570,
                discountType: 2,
                efficientItemPrice: 1200,
                manual: '',
            },
        ],
    },
    {
        id: '2',
        name: 'Обед в офис',
        totalPrice: 1580,
        totalCalories: 2380,
        restaurantName: 'Sushi Time',
        OrderItems: [
            {
                itemName: 'Ролл Филадельфия',
                itemPrice: 690,
                calories: 980,
                discountType: null,
                efficientItemPrice: 690,
                manual: '',
            },
            {
                itemName: 'Ролл Калифорния',
                itemPrice: 590,
                calories: 850,
                discountType: 1,
                efficientItemPrice: 530,
                manual: '',
            },
            {
                itemName: 'Мисо-суп',
                itemPrice: 300,
                calories: 550,
                discountType: null,
                efficientItemPrice: 300,
                manual: '',
            },
        ],
    },
    {
        id: '3',
        name: 'Семейный заказ',
        totalPrice: 4890,
        totalCalories: 6350,
        restaurantName: 'Italiano Pizza',
        OrderItems: [
            {
                itemName: 'Пицца Пепперони 35см',
                itemPrice: 1690,
                calories: 2100,
                discountType: null,
                efficientItemPrice: 1690,
                manual: '',
            },
            {
                itemName: 'Пицца Маргарита 35см',
                itemPrice: 1390,
                calories: 1750,
                discountType: 2,
                efficientItemPrice: 1250,
                manual: '',
            },
            {
                itemName: 'Паста Карбонара',
                itemPrice: 890,
                calories: 1200,
                discountType: null,
                efficientItemPrice: 890,
                manual: '',
            },
            {
                itemName: 'Тирамису',
                itemPrice: 920,
                calories: 1300,
                discountType: 1,
                efficientItemPrice: 820,
                manual: '',
            },
        ],
    },
    {
        id: '4',
        name: 'Перекус вечером',
        totalPrice: 890,
        totalCalories: 1120,
        restaurantName: 'KFC',
        OrderItems: [
            {
                itemName: 'Стрипсы 3 шт',
                itemPrice: 390,
                calories: 480,
                discountType: null,
                efficientItemPrice: 390,
                manual: '',
            },
            {
                itemName: 'Картофель по-деревенски',
                itemPrice: 250,
                calories: 340,
                discountType: null,
                efficientItemPrice: 250,
                manual: '',
            },
            {
                itemName: 'Соус острый',
                itemPrice: 100,
                calories: 120,
                discountType: null,
                efficientItemPrice: 100,
                manual: '',
            },
            {
                itemName: 'Кола 0.5л',
                itemPrice: 150,
                calories: 180,
                discountType: 1,
                efficientItemPrice: 120,
                manual: '',
            },
        ],
    },
];
const OrderPage = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const currentOrder = searchParams.get('orderId') || null;
    const filters = useFilterStore((state) => state.filters);

    const reqBody = {
        restaurantId: filters.addressId,
        budget: filters.budget,
        peoplePreferences: filters.generalPreferences.map((item) => PreferencesToAPI(item)),
        variantsCount: filters.count,
    };

    const {
        data: allDishes,
        isLoading,
        error,
    } = useQuery(
        dishesQueryParams({
            filters: reqBody,
            isEnabled: !!filters.addressId,
        }),
    );

    const onOrderClick = (id: string) => {
        setSearchParams({ orderId: id }, { replace: true });
        navigate(`/dishlist/${id}`);
    };

    return (
        <section className={styles.mainSection}>
            <div className={styles.AdditionalInfo}>
                <div className={styles.backBtn}>
                    <BackBtn title="Назад к фильтрам" />
                </div>

                <h1>Варианты заказа</h1>

                <div className={styles.variantCounts}>Найдено {allDishes?.length} вариантов</div>
            </div>

            <div>
                {mockOrders.map((key, item) => (
                    <OrderComponent
                        key={item}
                        isCurrentOrder={key.id === currentOrder}
                        orderInfo={key}
                        onClick={(id) => onOrderClick(id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default OrderPage;
