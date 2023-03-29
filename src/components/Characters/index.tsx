import React, { ChangeEvent, FC } from 'react'
import styles from './styles.module.scss'

export interface CharactersProps {
  characters: string
  setCharacters: (cb: (prev: string) => string) => void
}

export const Characters: FC<CharactersProps> = ({ characters, setCharacters }) => {
  const onChange = ({ target: { value: val } }: ChangeEvent<HTMLInputElement>) => {
    setCharacters((prev) => {
      if (!val) return '0'

      if (/[0-9]|\./.test(val)) {
        if (+val > 1000) return '1000'
        if (val.startsWith('0')) return val.toString().slice(1)

        return val.toString()
      }

      return prev
    })
  }

  return (
    <div title="Characters" className={styles.characters}>
      <input
        value={characters}
        onChange={onChange}
        className={styles.input}
        type="number"
        style={{ color: +characters < 100 ? 'rgba(255,0,0, 0.8)' : 'inherit' }}
      />
    </div>
  )
}
