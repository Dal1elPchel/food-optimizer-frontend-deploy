import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import styles from './BackBtn.module.scss';

interface IProps {
    title: string;
}

const BackBtn = ({ title }: IProps) => {
    const navigate = useNavigate();
    return (
        <h1 className={styles.filtersTitle} onClick={() => navigate(-1)}>
            <ArrowLeft />
            {title}
        </h1>
    );
};

export default BackBtn;
