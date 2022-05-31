import React, { ReactElement } from 'react';
import styles from './form-control.module.scss';

export interface UIFormControlProps {
    label: string;
    name?: string;
    children: ReactElement;
    required?: boolean;
}

export const UIFormControl: React.FC<UIFormControlProps> = ({ label, name, children }) => (
    <div className={styles.formConrol}>
        <label htmlFor={name}>{label}<span className={styles.requiredIndicator}>*</span></label>
        {React.cloneElement(children, { id: name })}
    </div>
)