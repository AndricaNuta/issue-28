// ============================================================
//  PERSONALISE EVERYTHING HERE  ·  edit, save, done.
//  Anything marked TODO is a placeholder and will look like one.
// ============================================================

export const CONFIG = {
  // --- Her ---
  name: 'Ana',
  age: 28,
  // Printed in the running head at the top of every page.
  magazineName: 'The Birthday Girl',
  issueLabel: 'ISSUE 28',
  // A short script line above her name on the cover. '' hides it.
  coverKicker: 'cover star',
  issueDate: 'Birthday issue 2026',
  edition: 'Special edition',
  // Printed down the left of the cover, magazine style.
  coverLines: ["What's in her bag?", 'The 28-day plan', 'Your year ahead'],
  // For her access pass on the entry page. Keep it short and funny.
  occupation: 'Birthday girl',   // TODO
  // Why there is a laminated badge on page two of a magazine.
  passNote: 'Every cover star gets one of these. Yours came stapled inside.',

  // --- Photos: drop files in public/photos/ and list them here ---
  // Paths are relative (NO leading slash) so they work on GitHub Pages.
  photos: {
    // Her, waist up, facing camera, with one shoulder clearly visible.
    her: 'photos/her.jpg',   // TODO
    // The bag, cut out on a transparent background. This is what she drags
    // onto her arm on the last page.
    bag: 'photos/bag.png',
    // The same bag open from above. This is what she packs the wishes into.
    bagOpen: 'photos/bag-open.png',
    // The product gallery on the reveal page: she should see it clearly.
    // Drop more shots into public/photos/bag/ and list them here, first one
    // is the one shown when the page opens.
    bagShots: ['photos/bag.png', 'photos/bag-open.png', 'photos/bag-alt.jpg'],
    // Her mid sheet-mask, for the spa advertorial. Funny on purpose.
    mask: 'photos/mask.jpg',
    // A childhood photograph, for the "this is who turns 28" pass.
    baby: 'photos/baby.jpg',
    // The real one, underneath the glossy cover shot. Crocs and all.
    herReal: 'photos/her-real.jpg',
  },

  // Where the mouth of the open bag sits, as percentages of that photo.
  // A wish dropped inside this circle goes in. Generous on purpose.
  bagMouth: { x: 46, y: 55, r: 30 },

  // --- Where the bag has to land when she tries it on ---
  // Percentages of the photo frame. Open the page with `npm run dev` and drag
  // the bag around: a readout under it prints the coordinates. Copy them here.
  bagTarget: {
    x: 25,          // % from left · her raised forearm
    y: 58,          // % from top
    size: 30,       // bag width as % of frame width
    tolerance: 15,  // how close counts (% of frame width). Bigger is kinder.
    rotation: -6,   // resting tilt in degrees
  },

  // Where the bag lands on the REAL photograph, once she has wiped the
  // glossy one away. Same percentages as bagTarget, different picture.
  bagTargetReal: {
    x: 65,
    y: 50,
    size: 26,
    rotation: 5,
  },

  // --- Gift one: the bag ---
  bag: {
    // Presented like the listing she was looking at, and then it is hers.
    brand: 'Aest Studios',
    name: 'Capture Medium Sling Bag',

    // The announcement, before she sees anything. It arrived too suddenly
    // before: a bag appeared with no indication it was the first gift.
    announceKicker: 'Presents · one of two',
    announceTitle: 'Your first present.',
    announceBody:
      'There are two of them at the back of this issue. This is the one you can carry.',

    introTitle: 'This one.',
    introBody: 'The one you kept going back to look at. It is not a browser tab any more.',
    task: 'Put it on her shoulder',

    // After it lands on the glossy shot: the joke, and the wipe.
    oopsTitle: 'Hm. Too much.',
    oopsBody: 'Hold on, that is the version for the magazine. Wipe it off.',
    oopsCue: 'wipe it',

    title: 'There she is.',
    body: 'Crocs optional, bag compulsory. Go and be insufferable about it.',
  },

  // --- Gift two: the massage voucher (scratch to reveal) ---
  voucher: {
    place: 'PLACE HERE',            // TODO spa or salon
    treatment: 'Full body massage', // TODO
    duration: '60 minutes',         // TODO
    validUntil: '',                 // TODO e.g. '31 March 2027'. '' hides it.
    code: '',                       // TODO voucher code. '' hides it.
    note: 'The only part of the wellness plan that is compulsory.',

    // --- Why this gift, before the reveal. Edit freely, this is the sincere bit. ---
    noteKicker: 'Health & wellbeing',
    noteTitle: 'You work too hard.',
    noteBody:
      'We have watched you go all year. You answer at midnight, you show up when you have nothing left, you carry everyone. We would like to see you horizontal for once, doing nothing, on purpose.',
    // Printed under the photograph, in the voice of a real advertorial.
    caption: 'Exhibit A. The only hour we have seen you lie still all year.',

    // --- The petition. Sixteen signatures, then a stamp. ---
    petitionTitle: 'A petition',
    petitionDemand:
      'lie down for sixty consecutive minutes, phone in another room, answering to nobody',
    petitionStamp: 'Granted',
    petitionNote: 'Signed by all sixteen of us, and non-negotiable.',
  },

  // --- Sign-off ---
  closing: 'Happy 28th. Same time next issue.',
}

// ============================================================
//  THE 28-DAY PLAN
//  Her wish this year was to get fit and put her life in order, so
//  we did it for her. Each line, when she taps it, produces the
//  photographic proof and gets struck off.
//
//  IMAGES: drop one per line into public/photos/plan/ as 01.jpg,
//  02.jpg and so on, matching the order below. Badly cut out is
//  funnier than seamless, so do not be careful with them. Any line
//  with no image still works: it strikes off, with the note only.
// ============================================================
export const PLAN = {
  kicker: 'Wellness',
  title: 'The 28-Day Plan',
  standfirst:
    'We know all you wanted for your birthday this year was to get fit, put your life in order and other Virgo-like wishes.',
  claim: 'So we completed them for you.',
  cue: 'tap each one',
  items: [
    {
      text: 'Wake at 5am, radiant, unprompted',
      photo: 'photos/plan/01.jpg',
      evidence: 'Completed. Radiance still pending.',
    },
    {
      text: 'Gym six times a week',
      photo: 'photos/plan/02.jpg',
      evidence: 'Completed. Six times, one week, someone else\u2019s body.',
    },
    {
      text: 'Eat exclusively green things',
      photo: 'photos/plan/03.jpg',
      evidence: 'Completed. Pistachio counts, we checked.',
    },
    {
      text: 'Build the CEO mindset',
      photo: 'photos/plan/04.jpg',
      evidence: 'Completed. You have been promoted, effective immediately.',
    },
    {
      text: '10,000 steps a day',
      photo: 'photos/plan/05.jpg',
      evidence: 'Completed. Mostly around a shop.',
    },
  ],
  // The line nobody had to do anything about.
  keep: 'Be loved exactly as you are',
  keepNote: 'This one was already done.',
  payoff:
    'Just so you know, with or without these completed, you are loved exactly as you are.',
}

// ============================================================
//  THE SIXTEEN
//  A polaroid each. `photo` is a file in public/photos/people/.
//  Drop the photos into a folder and run:
//      python3 scripts/people.py ~/Downloads/people
//  which shrinks and numbers them into public/photos/people/.
//  `name` is written along the bottom of the polaroid. Set it to ''
//  for a photograph with no caption.
//  TODO replace all sixteen names.
// ============================================================
export const PEOPLE = Array.from({ length: 16 }, (_, i) => ({
  name: `Person ${i + 1}`,
  photo: `photos/people/${String(i + 1).padStart(2, '0')}.jpg`,
  // Which part of the photo the square polaroid window shows. Handy for group
  // shots: 'center 20%' pulls it up, 'left center' pulls it left.
  focus: 'center 35%',
}))

export const PACK = {
  title: 'Filling the bag with our memories together',
  standfirst: 'Flick through.',
  done: 'All of it goes in the bag.',
  doneBody: 'Every one of these comes with you, and none of it takes up any room.',
}

// ============================================================
//  THE READING
//  A three card spread for the year, plus one uninvited extra.
//  Readings are about the year, not about her character, so nothing
//  here can land wrong. Edit them freely.
//  Card art lives in public/photos/tarot/.
// ============================================================
export const TAROT = {
  kicker: 'The reading',
  title: 'Your Year Ahead',
  standfirst:
    'We know we are not a witch in the Amazonian forest, but we think we can see the future pretty clearly.',
  cue: 'turn them over',
  cards: [
    {
      position: 'Where you are',
      name: 'Strength',
      image: 'photos/tarot/strength.jpg',
      reading:
        'You have been carrying everything, and doing it gently. The card is not about force. It says you may put some of it down.',
    },
    {
      position: 'What carries you',
      name: 'The Empress',
      image: 'photos/tarot/empress.jpg',
      reading:
        'Everything around you grows because you tend it. Sixteen people are proof. Let some of that care point back at you this year.',
    },
    {
      position: 'What is coming',
      name: 'The Sun',
      image: 'photos/tarot/sun.jpg',
      reading:
        'It gets easier. Not all at once, and not because you earned it by being perfect. Twenty-eight is a warm one.',
    },
  ],
  bonus: {
    position: 'Uninvited',
    name: 'The Finger',
    image: 'photos/tarot/finger.jpg',
    intro: 'The deck insisted on one more.',
    reading:
      'For anybody who gives you grief this year. Drawn on your behalf, by all sixteen of us.',
  },
}
