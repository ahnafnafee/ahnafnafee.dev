import { useCallback, useState } from 'react'

export const useTags = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const setNewTag = useCallback((tag: string) => {
    return () => {
      setSelectedTags((prevState) =>
        prevState.includes(tag) ? prevState.filter((p) => !p.includes(tag)) : [...prevState, tag]
      )
    }
  }, [])

  return {
    selectedTags,
    setNewTag
  }
}
