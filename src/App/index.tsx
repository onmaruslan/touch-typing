import React, {
  FC, useState, useEffect, useCallback, useMemo,
} from 'react'
import styles from './styles.module.scss'
import { TypingPlace } from '../components/TypingPlace'
import { Interactive } from '../components/Interactive'
import { Statistics } from '../components/Statistics'
import { useDebounce } from '../utils/useDebounce'
import { engList, rusList } from '../text'
import { getText } from '../utils/getText'

let timeout: NodeJS.Timeout

export const App: FC = () => {
  const [bestSpeed, setBestSpeed] = useState(0)
  const [alarm, setAlarm] = useState('')
  const [characters, setCharacters] = useState(localStorage.getItem('characters') ?? '500')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEng, setIsEng] = useState(localStorage.getItem('isEng') === 'true')
  const [text, setText] = useState(getText(isEng ? engList : rusList, +characters))
  const [isStarted, setIsStarted] = useState(false)
  const [misspelledWords, setMisspelledWords] = useState(0)
  const [time, setTime] = useState({ sec: 0, min: 0 })

  const charactersDebounce: string = useDebounce<string>(characters, 500)

  const reset = useCallback(() => {
    setText(getText(isEng ? engList : rusList, +charactersDebounce))

    setValue('')
    setIsStarted(false)
    setTime({ sec: 0, min: 0 })
    setMisspelledWords(0)
  }, [charactersDebounce, isEng])

  const toggleLang = useCallback(() => {
    setIsEng((prev) => !prev)
    reset()
  }, [reset])

  useEffect(() => {
    setLoading(true)
    clearTimeout(timeout)
    timeout = setTimeout(() => setLoading(false), 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [characters, isEng])

  useEffect(() => reset(), [charactersDebounce, reset, isEng])
  useEffect(() => localStorage.setItem('characters', String(charactersDebounce)), [charactersDebounce])
  useEffect(() => localStorage.setItem('isEng', String(isEng)), [isEng])

  const handleStart = () => {
    if (value) reset()

    setIsStarted(true)
  }
  const countWords = useMemo(
    () => text.replaceAll(/\n/g, '').split(' ').length,
    [text],
  )

  const exerciseTimeField = useMemo(
    () => `${time.min < 10 ? 0 : ''}${time.min}:${time.sec < 10 ? 0 : ''}${time.sec}`,
    [time.min, time.sec],
  )

  const misspelledWordsPercentField = useMemo(
    () => Math.round(((misspelledWords * 100) / countWords)),
    [misspelledWords, countWords],
  )

  const currentSpeedField = useMemo(
    () => ((time.sec / 60 + time.min)
      ? Math.round(+characters / (time.sec / 60 + time.min))
      : 0),
    [characters, time],
  )

  useEffect(() => {
    const bestTypingSpeed = localStorage.getItem('bestSpeed') ?? 0

    if (+bestTypingSpeed > currentSpeedField) {
      setBestSpeed(+bestTypingSpeed)
    }
    if ((+bestTypingSpeed < currentSpeedField) && (misspelledWordsPercentField <= 5) && (+characters >= 100)) {
      setBestSpeed(currentSpeedField)
      localStorage.setItem('bestSpeed', String(currentSpeedField))
    }
  }, [currentSpeedField, misspelledWordsPercentField, characters])

  useEffect(() => {
    if (misspelledWordsPercentField > 5 && +characters < 100) setAlarm(isEng
      ? 'Too many words with errors and too few characters. The result will not be recorded.'
      : 'Слишком много слов с ошибками и мало символов. Результат не будет записан.')
    else if (misspelledWordsPercentField > 5) setAlarm(isEng
      ? 'Too many words with errors. The result will not be recorded.'
      : 'Слишком много слов с ошибками. Результат не будет записан.')
    else if (+characters < 100) setAlarm(isEng
      ? 'Should be at least 100 characters. The result will not be recorded.'
      : 'Должно быть минимум 100 символов. Результат не будет записан.')
    else setAlarm('')
  }, [characters, misspelledWordsPercentField, isEng])

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <TypingPlace
          value={value}
          onChange={setValue}
          text={text}
          setMisspelledWords={setMisspelledWords}
          setTime={setTime}
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          alarm={alarm}
          isEng={isEng}
        />
        <div className={styles.bottomWrapper}>
          <Interactive
            characters={characters}
            setCharacters={setCharacters}
            loading={loading}
            reset={reset}
            isEng={isEng}
            toggleLang={toggleLang}
            isStarted={isStarted}
            handleStart={handleStart}
          />
          <Statistics
            isStarted={isStarted}
            exerciseTime={exerciseTimeField}
            misspelledWords={misspelledWords}
            misspelledWordsPercent={misspelledWordsPercentField}
            currentSpeed={currentSpeedField}
            bestSpeed={bestSpeed}
            isEng={isEng}
          />
        </div>
      </div>
    </div>
  )
}
