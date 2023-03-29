import React, {
  ChangeEvent, FC, KeyboardEvent, useState, useEffect, useRef, RefObject,
} from 'react'
import styles from './styles.module.scss'
import { TypingPlaceItem } from './TypingPlaceItem'
import { Alarm } from '../Alarm'

interface TypingPlaceProps {
  value: string
  text: string
  alarm: string
  onChange: (cb: (prev: string) => string) => void
  setMisspelledWords: (words: number) => void
  setTime: (time: { sec: number, min: number }) => void
  isStarted: boolean
  setIsStarted: (bool: boolean) => void
  isEng: boolean
}

export const TypingPlace: FC<TypingPlaceProps> = ({
  value,
  onChange,
  text,
  setMisspelledWords,
  isStarted,
  setIsStarted,
  setTime,
  alarm,
  isEng,
}) => {
  const [passed, setPassed] = useState<{ value: string; status: boolean }[]>([])
  const [left, setLeft] = useState(text.trim().replaceAll('\n', '\n ').split(' '))
  const [misspelledWordsLocal, setMisspelledWordsLocal] = useState(0)
  const [timeLocal, setTimeLocal] = useState({
    sec: 0,
    min: 0,
  })

  useEffect(() => {
    setPassed([])
    setLeft(text.trim().replaceAll('\n', '\n ').split(' '))
    setMisspelledWordsLocal(0)
    setTimeLocal({ sec: 0, min: 0 })
  }, [text])

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null)

  const updateTimer = () => {
    setTimeLocal((prev) => {
      const newTime = { ...prev }
      if (newTime.sec < 59) newTime.sec += 1
      else {
        newTime.min += 1
        newTime.sec = 0
      }

      return newTime
    })
  }

  const startTimer = () => {
    if (!intervalId) {
      const id = setInterval(updateTimer, 1000)
      setIntervalId(id)
    }
  }
  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  const resetTimer = () => {
    pauseTimer()
    setTimeLocal({
      sec: 0,
      min: 0,
    })
  }

  const $input = useRef() as RefObject<HTMLTextAreaElement>

  const finishTyping = () => {
    setTime(timeLocal)
    setMisspelledWords(misspelledWordsLocal)
    setIsStarted(false)
    resetTimer()
    setMisspelledWordsLocal(0)
  }

  const handleKeydown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    startTimer()

    const { keyCode } = event
    const currentValue = value.replace(/\s/g, ' ').split(' ')?.pop()?.trim()

    if ($input?.current && $input?.current?.selectionStart < value.length)
      $input?.current?.setSelectionRange(value.length, value.length)

    if ((keyCode === 13 || keyCode === 32) && currentValue?.length) {
      const status = currentValue === left[0].trim()

      if (!status) setMisspelledWordsLocal((prev) => prev + 1)

      setPassed((prev) => [...prev, { value: left[0], status }])
      setLeft((prev) => prev.slice(1))
    }
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!left.length) finishTyping()

    const { value: v } = event.target
    onChange((prev) => ((prev.length > v.length && v.trim() === prev.trim()) ? prev : v))
  }

  return (
    <div className={styles.wrapper}>
      {alarm?.length ? <Alarm message={alarm} /> : ''}
      <div className={styles.stopwatch}>
        {`${timeLocal.min < 10 ? 0 : ''}${timeLocal.min}:${timeLocal.sec < 10 ? 0 : ''}${timeLocal.sec}`}
      </div>
      <div className={styles.text}>
        {passed.map((item, i) => (
          <TypingPlaceItem key={`${i}—${item.value}`} text={item.value} isPassed={item.status} />))}
        {left.join(' ')}
      </div>
      <textarea
        className={styles.workplace}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        ref={$input}
        placeholder={isEng ? 'Start typing...' : 'Начните печатать...'}
        autoCapitalize="none"
        spellCheck={false}
        disabled={!isStarted}
      />
    </div>
  )
}
