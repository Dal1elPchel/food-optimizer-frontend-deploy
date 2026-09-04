import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useThemeStore } from '@/shared/lib/theme/useThemeStore';
import { AboutModal } from '@/widgets/AboutModal/ui/aboutModal';

import Logo from '../../../shared/assets/icons/Logo.png';
import styles from './Header.module.scss';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const theme = useThemeStore((s) => s.currentTheme);
    const onThemeToggle = useThemeStore((s) => s.toggleTheme);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    return (
        <>
            <header className={styles.header}>
                <Link to="/" className={styles.headerLogo}>
                    <img src={Logo} alt="Logo" />
                </Link>

                <nav
                    className={`${styles.headerNav} 
            ${isMobileMenuOpen ? styles.headerNavOpen : ''}`}
                >
                    <ul className={styles.menu}>
                        <li className={styles.menuItem}>
                            <Link to="/" onClick={closeMobileMenu}>
                                Главная
                            </Link>
                        </li>
                        <li className={styles.menuItem}>
                            <a
                                onClick={() => {
                                    closeMobileMenu();
                                    setAboutModalOpen(!aboutModalOpen);
                                }}
                            >
                                О проекте
                            </a>
                        </li>
                        <li className={styles.menuItem}>
                            <a onClick={closeMobileMenu}>Избранное</a>
                        </li>
                    </ul>
                </nav>

                <div className={styles.headerActions}>
                    <button
                        className={styles.headerNavButton}
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label="Открыть меню"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>

                    <button
                        className={styles.headerTheme}
                        onClick={onThemeToggle}

                        aria-label="Изменить тему"
                    >
                        {theme === 'dark' ? <Sun /> : <Moon />}
                    </button>
                </div>
            </header>

            <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
        </>
    );
};

export default Header;
