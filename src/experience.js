import { createContext, useContext, useEffect } from 'react'

// Read front to back, like an issue. There is no hub to return to: the earlier
// version put the bag on the very first screen after the cover, which gave away
// gift one, and sent her back to the same checklist after every page.
export const ROUTES = ['cover', 'pass', 'plan', 'year', 'gift1', 'bag', 'pack', 'gift2', 'spa', 'close']

// The folio number printed on each page, and what the contents page lists.
// `redacted` blacks the title out: those are the two gifts.
export const PAGES = {
  cover: { no: 1 },
  pass: { no: 2 },
  plan: { no: 3, title: 'The 28-Day Plan', note: 'The programme you asked for.' },
  year: { no: 5, title: 'The Reading', note: 'Three cards for the year ahead.' },
  gift1: { no: 6 },
  bag: { no: 7, title: 'The Bag', note: 'Bring your shoulder.', redacted: true },
  pack: { no: 9, title: 'Our Memories', note: 'Everything we have done together.' },
  gift2: { no: 10 },
  spa: { no: 11, title: 'Advertorial', note: 'Sixty compulsory minutes.', redacted: true },
  close: { no: 13 },
}

export const ExperienceContext = createContext({
  route: 'cover',
  go: () => {},
  next: () => {},
  setCta: () => {},
})
export const useExperience = () => useContext(ExperienceContext)

// A page declares its forward action and the arrow appears, pinned to the
// bottom of the screen where a thumb already is. Previously each page put its
// own button after its content, so the way on moved around and had to be
// scrolled to.
export function useCta(cta, deps) {
  const { setCta } = useExperience()
  useEffect(() => {
    setCta(cta || null)
    return () => setCta(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// Backdrops stay within a whisker of the paper colour. The two gift pages are
// the only ones that shift, and even then barely.
const BG = {
  cover: 'linear-gradient(180deg, #F4EEE5 0%, #EAE1D4 100%)',
  pass: 'linear-gradient(180deg, #F2ECE2 0%, #E8DFD2 100%)',
  plan: 'linear-gradient(180deg, #F5EFE6 0%, #EDE3D6 100%)',
  year: 'linear-gradient(180deg, #F3ECE4 0%, #EADFD5 100%)',
  gift1: 'linear-gradient(180deg, #F3E7E2 0%, #E8D2CB 100%)',
  bag: 'linear-gradient(180deg, #F2E9E2 0%, #E9D8D0 100%)',
  pack: 'linear-gradient(180deg, #F2ECE3 0%, #E7DED1 100%)',
  gift2: 'linear-gradient(180deg, #EFF0E5 0%, #DEE3D6 100%)',
  spa: 'linear-gradient(180deg, #F0EFE6 0%, #E4E6DA 100%)',
  close: 'linear-gradient(180deg, #F4EDE4 0%, #EBDDD5 100%)',
}

export function bgFor(route) {
  return BG[route] || BG.cover
}
