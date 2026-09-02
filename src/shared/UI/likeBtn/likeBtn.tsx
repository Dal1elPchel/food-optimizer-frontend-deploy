import { Heart } from 'lucide-react';
import React from 'react';

import styles from './likeBtn.module.scss';
const LikeBtn = () => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
            }}
            className={styles.likeBtn}
        >
            <Heart />
        </button>
    );
};

export default LikeBtn;
