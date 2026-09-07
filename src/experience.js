import { createContext, useContext } from 'react'

// Read front to back, like an issue. There is no hub to return to: the earlier
// version put the bag on the very first screen after the cover, which gave away
// gift one, and sent her back to the same checklist after every page.
export const ROUTES = ['cover', 'pass', 'contents', 'plan', 'year', 'bag', 'pack', 'spa', 'close']

// The folio number printed on each page, and what the contents page lists.
// `redacted` blacks the title out: those are the two gifts.
export const PAGES = {
  cover: { no: 1 },
  pass: { no: 2 },
  contents: { no: 3 },
  plan: { no: 4, title: 'The 28-Day Plan', note: 'The programme you asked for.' },
  year: { no: 6, title: 'Your Year Ahead', note: 'Three predictions, unverifiable.' },
  bag: { no: 8, title: 'The Cover Shoot', note: 'Bring your shoulder.', redacted: true },
  pack: { no: 10, title: 'Sixteen Wishes', note: 'Everyone had something to say.' },
  spa: { no: 12, title: 'Advertorial', note: 'Sixty compulsory minutes.', redacted: true },
  close: { no: 14 },
}

export const CONTENTS = ['plan', 'year', 'bag', 'pack', 'spa']

export const ExperienceContext = createContext({ route: 'cover', go: () => {}, next: () => {} })
export const useExperience = () => useContext(ExperienceContext)

// Backdrops stay within a whisker of the paper colour. The two gift pages are
// the only ones that shift, and even then barely.
const BG = {
  cover: 'linear-gradient(180deg, #F4EEE5 0%, #EAE1D4 100%)',
  pass: 'linear-gradient(180deg, #F2ECE2 0%, #E8DFD2 100%)',
  contents: 'linear-gradient(180deg, #F3EDE4 0%, #E9E0D3 100%)',
  plan: 'linear-gradient(180deg, #F5EFE6 0%, #EDE3D6 100%)',
  year: 'linear-gradient(180deg, #F3ECE4 0%, #EADFD5 100%)',
  bag: 'linear-gradient(180deg, #F2E9E2 0%, #E9D8D0 100%)',
  pack: 'linear-gradient(180deg, #F2ECE3 0%, #E7DED1 100%)',
  spa: 'linear-gradient(180deg, #F0EFE6 0%, #E4E6DA 100%)',
  close: 'linear-gradient(180deg, #F4EDE4 0%, #EBDDD5 100%)',
}

export function bgFor(route) {
  return BG[route] || BG.cover
}
