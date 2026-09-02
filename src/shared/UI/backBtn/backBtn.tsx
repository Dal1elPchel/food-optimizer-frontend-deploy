import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useWindowWidth from '@/shared/lib/hooks/useWindowWidth';

import styles from './BackBtn.module.scss';

interface IProps {
    title: string;
}

const BackBtn = ({ title }: IProps) => {
    const navigate = useNavigate();
    const width = useWindowWidth();
    return (
        <h1 className={styles.filtersTitle} onClick={() => navigate(-1)}>
            <ArrowLeft />
            {width > 1100 && title}
        </h1>
    );
};

export default BackBtn;
