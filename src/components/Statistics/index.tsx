import React, { FC } from 'react'
import styles from './styles.module.scss'

interface ItemProps {
  text: string
  value: string
  isRed?: boolean
}

interface StatisticsProps {
  isStarted: boolean
  exerciseTime: string
  misspelledWords: number
  misspelledWordsPercent: number
  currentSpeed: number
  bestSpeed: number
  isEng: boolean
}

const Item: FC<ItemProps> = ({
  text, value, isRed = false,
}) => (
  <div className={styles.item}>
    <div>{text}</div>
    <div className={styles.value} style={{ color: isRed ? 'rgba(255,0,0, 0.8)' : 'inherit' }}>{value}</div>
  </div>
)

export const Statistics: FC<StatisticsProps> = ({
  isStarted,
  exerciseTime,
  misspelledWords,
  currentSpeed,
  misspelledWordsPercent,
  bestSpeed,
  isEng,
}) => (
  <div className={styles.wrapper} style={{ opacity: isStarted ? '0.4' : '1' }}>
    <Item text={isEng ? 'Exercise time' : 'Время тренировки'} value={exerciseTime} />
    <Item
      text={isEng ? 'Misspelled words' : 'Слов с ошибками'}
      value={`${misspelledWords} / ${misspelledWordsPercent}%`}
      isRed={misspelledWordsPercent > 5}
    />
    <Item
      text={isEng ? 'Current typing speed' : 'Текущая скорость печати'}
      value={`${currentSpeed} ${isEng ? 'char/min' : 'симв/мин'}`}
    />
    <Item
      text={isEng ? 'The best typing speed' : 'Лучшая скорость печати'}
      value={`${bestSpeed} ${isEng ? 'char/min' : 'симв/мин'}`}
    />
  </div>
)
