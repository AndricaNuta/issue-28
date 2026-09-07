import { createContext, useContext } from 'react'

// The journey is a hub, not a corridor. She unlocks the issue, lands on a
// checklist of three tasks, and comes back to it after each one. The gifts stay
// shut until the list is clear, so at every moment it is obvious what is left.
export const ROUTES = ['cover', 'pass', 'hub', 'pack', 'plan', 'year', 'bag', 'spa', 'close']

export const TASKS = [
  { id: 'pack', route: 'pack', label: 'Fill the bag', hint: 'Sixteen wishes, one from each of us.' },
  { id: 'plan', route: 'plan', label: 'The 28-day plan', hint: 'Tick what you will actually do.' },
  { id: 'year', route: 'year', label: 'Your year ahead', hint: 'Three predictions. Turn them over.' },
]

export const ExperienceContext = createContext({
  route: 'cover',
  done: new Set(),
  allDone: false,
  go: () => {},
  complete: () => {},
})

export const useExperience = () => useContext(ExperienceContext)

// Backdrops stay within a whisker of the paper colour. Only the two gift pages
// shift, and even then barely: the point is that the photographs and the type
// carry the page.
const BG = {
  cover: 'linear-gradient(180deg, #F4EEE5 0%, #EAE1D4 100%)',
  pass: 'linear-gradient(180deg, #F2ECE2 0%, #E8DFD2 100%)',
  hub: 'linear-gradient(180deg, #F3EDE4 0%, #E9E0D3 100%)',
  pack: 'linear-gradient(180deg, #F2ECE3 0%, #E7DED1 100%)',
  plan: 'linear-gradient(180deg, #F5EFE6 0%, #EDE3D6 100%)',
  year: 'linear-gradient(180deg, #F3ECE4 0%, #EADFD5 100%)',
  bag: 'linear-gradient(180deg, #F2E9E2 0%, #E9D8D0 100%)',
  spa: 'linear-gradient(180deg, #F0EFE6 0%, #E4E6DA 100%)',
  close: 'linear-gradient(180deg, #F4EDE4 0%, #EBDDD5 100%)',
}

export function bgFor(route) {
  return BG[route] || BG.cover
}
