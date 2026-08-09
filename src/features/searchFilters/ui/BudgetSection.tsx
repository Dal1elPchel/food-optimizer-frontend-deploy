import { useEffect, useRef } from 'react';

import styles from '../styles/Filters.module.scss';

interface Field<T> {
    value: T;
    change: (value: T) => void;
}

interface BudgetProps {
    budget: Field<number>;
    personCount: Field<number>;
    count: Field<number>;
}

const BudgetSection = ({ budget, personCount, count }: BudgetProps) => {
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const personCountRef = useRef(personCount.value);
    const countRef = useRef(count.value);

    useEffect(() => {
        personCountRef.current = personCount.value;
    }, [personCount.value]);

    useEffect(() => {
        countRef.current = count.value;
    }, [count.value]);

    const onChangeNumberData = (
        field: React.MutableRefObject<number>,
        change: (value: number) => void,
        limitNumber: number,
        direction: 'increase' | 'decrease',
    ) => {
        const current = field.current;
        if (direction === 'increase') {
            change(Math.min(limitNumber, current + 1));
        } else if (direction === 'decrease') {
            change(Math.max(limitNumber, current - 1));
        }
    };

    const startHold = (
        field: React.MutableRefObject<number>,
        change: (value: number) => void,
        limitNumber: number,
        direction: 'increase' | 'decrease',
    ) => {
        const tick = () => {
            onChangeNumberData(field, change, limitNumber, direction);
            intervalRef.current = setTimeout(tick, 200);
        };
        intervalRef.current = setTimeout(tick, 50);
    };

    const stopHold = () => {
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <section className={styles.filterSection}>
            <div>
                <label className={styles.filterLabel}>4. Введите бюджет:</label>

                <div>
                    <input
                        type="range"
                        min="100"
                        className={styles.budgetInput}
                        max="10000"
                        step="100"
                        value={budget.value}
                        onChange={(e) => {
                            const value = Number(e.target.value);

                            if (value >= 0 && value <= 10000) {
                                budget.change(value);
                            }
                        }}
                    />

                    <div className={styles.budgetRangeLabels}>
                        <span>500 ₽</span>
                        <span>10000 ₽</span>
                    </div>
                </div>

                <div className={styles.budgetLabel}>{budget.value}</div>

                <label className={styles.filterLabel}>5. Сколько человек:</label>

                <div className={styles.peopleCount}>
                    <button
                        disabled={personCount.value === 1}
                        onMouseDown={() => {
                            startHold(personCountRef, personCount.change, 1, 'decrease');
                        }}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}
                        onTouchStart={() => {
                            startHold(personCountRef, personCount.change, 1, 'decrease');
                        }}
                        onTouchEnd={stopHold}
                        onTouchCancel={stopHold}
                    >
                        -
                    </button>

                    <span>{personCount.value}</span>

                    <button
                        disabled={personCount.value === 20}
                        onMouseDown={() => {
                            startHold(personCountRef, personCount.change, 20, 'increase');
                        }}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}

                        onTouchStart={() => {
                            startHold(personCountRef, personCount.change, 20, 'increase');
                        }}
                        onTouchEnd={stopHold}
                        onTouchCancel={stopHold}
                    >
                        +
                    </button>
                </div>

                <label className={styles.filterLabel}>
                    6. количество вариантов заказа (необязательно):
                </label>

                <div className={styles.peopleCount}>
                    <button
                        disabled={count.value === 1}
                        onMouseDown={() => {
                            startHold(countRef, count.change, 1, 'decrease');
                        }}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}
                        onTouchStart={() => {
                            startHold(countRef, count.change, 1, 'decrease');
                        }}
                        onTouchEnd={stopHold}
                        onTouchCancel={stopHold}
                    >
                        -
                    </button>

                    <span>{count.value}</span>

                    <button
                        disabled={count.value === 20}
                        onMouseDown={() => {
                            startHold(countRef, count.change, 20, 'increase');
                        }}
                        onMouseUp={stopHold}
                        onMouseLeave={stopHold}
                        onTouchStart={() => {
                            startHold(countRef, count.change, 20, 'increase');
                        }}
                        onTouchEnd={stopHold}
                        onTouchCancel={stopHold}
                    >
                        +
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BudgetSection;
