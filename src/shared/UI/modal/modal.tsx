import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
}

const ANIMATION_DURATION = 300;

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            setIsClosing(false);
            setShouldRender(true);
        } else if (shouldRender) {
            setIsClosing(true);
            closeTimeoutRef.current = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, ANIMATION_DURATION);
        }

        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!shouldRender) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [shouldRender, onClose]);

    if (!shouldRender) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
            onClick={handleOverlayClick}
        >
            <div
                className={`${styles.sheet} ${isClosing ? styles.sheetClosing : ''}`}
                role="dialog"
                aria-modal="true"
            >
                <div className={styles.header}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>{children}</div>
            </div>
        </div>,
        document.body,
    );
};
