import React, { FC } from 'react'
import styles from './styles.module.scss'
import { Button } from '../Button'
import { Flags } from '../Flags'
import { Characters } from '../Characters'
import { Reset } from '../Reset'

interface InteractiveProps {
  characters: string
  loading: boolean
  isEng: boolean
  isStarted: boolean
  toggleLang: () => void
  setCharacters: (cb: (prev: string) => string) => void
  handleStart: () => void
  reset: () => void
}

export const Interactive: FC<InteractiveProps> = ({
  characters,
  setCharacters,
  loading,
  reset,
  toggleLang,
  isEng,
  handleStart,
  isStarted,
}) => (
  <div className={styles.wrapper} style={{ opacity: loading ? '0.4' : '1', pointerEvents: loading ? 'none' : 'auto' }}>
    <div className={styles.settingsWrapper} style={{ opacity: isStarted ? '0.5' : '1' }}>
      <Flags isEng={isEng} toggleLang={toggleLang} />
      <Reset loading={loading} reset={reset} />
      <Characters characters={characters} setCharacters={setCharacters} />
    </div>
    <Button text={isEng ? 'Start' : 'Начать'} onClick={handleStart} disabled={isStarted} />
  </div>
)
