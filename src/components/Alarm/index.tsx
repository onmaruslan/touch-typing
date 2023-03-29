import React, { FC } from 'react'
import styles from './styles.module.scss'

export interface AlarmProps {
  message: string
}

export const Alarm: FC<AlarmProps> = ({ message }) => (
  <div className={styles.alarm}>
    {message}
  </div>
)
