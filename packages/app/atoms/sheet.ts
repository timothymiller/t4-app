import { atom, useAtom } from 'jotai'

const sheetOpenAtom = atom(false)

export function useSheetOpen() {
  return [...useAtom(sheetOpenAtom)] as const
}
