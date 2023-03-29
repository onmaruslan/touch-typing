import React, { FC } from 'react'
import styles from './styles.module.scss'

export interface ButtonProps {
  text: string;
  disabled: boolean;
  onClick: () => void
}

export const Button: FC<ButtonProps> = ({ text, onClick, disabled }) => (
  <button className={styles.button} type="button" onClick={onClick} disabled={disabled}>
    {text}
  </button>
)
