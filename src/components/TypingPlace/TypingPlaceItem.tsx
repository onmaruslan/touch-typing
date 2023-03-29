import React, { FC } from 'react'
import styles from './styles.module.scss'

interface TypingPlaceItemProps {
  text: string
  isPassed?: boolean
}

export const TypingPlaceItem: FC<TypingPlaceItemProps> = ({ text, isPassed = true }) => (
  <span className={isPassed ? styles.ok : styles.bad}>
    {text}
    {' '}
  </span>
)
