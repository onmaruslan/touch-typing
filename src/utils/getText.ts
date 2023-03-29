export const getText = (
  arr: string[],
  chars: number,
  prev: string | undefined = '',
): string => {
  const text = `${prev}\n${arr[Math.floor(Math.random() * arr.length)]}`

  if (text.length >= chars + 1) return text.trim().slice(0, +chars)

  return getText(arr, chars, text)
}
