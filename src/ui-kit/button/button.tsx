import React, { MouseEventHandler } from 'react';
import styles from './button.module.scss';

export interface UIButtonProps {
    label: string | React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const UIButton: React.FC<UIButtonProps> = ({ label, onClick, type = 'button' }) => (
    <button onClick={onClick} type={type} className={styles.button}>{label}</button>
);