import { Code2, Gauge, Wallet } from 'lucide-react';

import { Modal } from '@/shared/UI/modal/modal';

import styles from './aboutModal.module.scss';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FEATURES = [
    {
        icon: Gauge,
        title: 'Оптимизация под калории и бюджет',
        text: 'Алгоритм подбирает комбинацию блюд из меню так, чтобы уложиться в заданную калорийность и цену — вместо ручного перебора вариантов.',
    },
    {
        icon: Wallet,
        title: 'Экономия без потери рациона',
        text: 'Сравнивает десятки комбинаций заказов и находит самую выгодную по цене за нужную питательность.',
    },
    {
        icon: Code2,
        title: 'Открытая архитектура',
        text: 'Фронтенд на React + TypeScript, состояние — Zustand и TanStack Query, backend отдаёт данные через REST API.',
    },
];

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="FoodOptimizer">
            <p className={styles.intro}>
                Сервис, который решает конкретную задачу: подобрать заказ из меню так, чтобы попасть
                в желаемые калории и не переплатить. Никакой магии — просто алгоритм, который делает
                за вас то, на что вручную ушло бы полчаса сравнения меню.
            </p>

            <ul className={styles.featureList}>
                {FEATURES.map(({ icon: Icon, title, text }) => (
                    <li key={title} className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            <Icon size={18} />
                        </div>
                        <div>
                            <h4 className={styles.featureTitle}>{title}</h4>
                            <p className={styles.featureText}>{text}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className={styles.footer}>
                <span className={styles.footerLabel}>Версия</span>
                <span>0.1.0 — в активной разработке</span>
            </div>
        </Modal>
    );
};
