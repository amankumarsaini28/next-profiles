import { ChangeEventHandler } from 'react';
import styles from './input.module.scss';

export type UIInputProps = ({
    value?: string;
    type?: 'text' | 'tel' | 'email' | 'date';
} | {
    value?: number;
    type?: 'number';
}) & {
    id?: string;
    readOnly?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>
}

export const UIInput: React.FC<UIInputProps> = ({ onChange, id, type = 'text', value = '', readOnly }) => (
    <input {...{ onChange, type, value, id, readOnly }} className={styles.input} />
);
