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
  // Captions under the two feature photographs.
  groupCaption: 'The editorial team, in full. Masthead, page 14.',
  // For her access pass on the entry page. Keep it short and funny.
  occupation: 'Birthday girl',   // TODO
  // The line under the pass. Say what this is, plainly.
  passNote: 'One issue, printed once, about you. Two of the pages at the back are gifts.',

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
    // Her mid sheet-mask, for the spa advertorial. Funny on purpose.
    mask: 'photos/mask.jpg',
    // A childhood photograph, for the "this is who turns 28" pass.
    baby: 'photos/baby.jpg',
    // The real one, underneath the glossy cover shot. Crocs and all.
    herReal: 'photos/her-real.jpg',
    // Opens the contents page: all of us, in one frame.
    group: 'photos/group.jpg',
    // Opens the wellness feature. Ideally her enjoying herself.
    plan: 'photos/plan.jpg',
  },

  // Where the mouth of the open bag sits, as percentages of that photo.
  // A wish dropped inside this circle goes in. Generous on purpose.
  bagMouth: { x: 46, y: 55, r: 30 },

  // --- Where the bag has to land (the cover shoot) ---
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
    introTitle: 'The cover is not finished.',
    introBody:
      'There is something missing from the shot. It belongs to you, and it belongs on your shoulder. Put it there and the cover is done.',
    task: 'Drag the bag onto her shoulder',

    // After it lands on the glossy shot: the joke, and the wipe.
    oopsTitle: 'Hm. Too much.',
    oopsBody: 'Hold on, that is the version for the magazine. Wipe it off.',
    oopsCue: 'wipe it',

    title: 'There she is.',
    body: 'All sixteen of us went in on it. Crocs optional, bag compulsory. Go be insufferable about it.',
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
//  Her wish this year was to get her life in order: clean eating,
//  the gym, the CEO morning. So the programme is printed, and then
//  struck out with a red pen, all but the last line.
//  Keep the lines short: they have to fit on one row each.
// ============================================================
export const PLAN = {
  kicker: 'Wellness',
  title: 'The 28-Day Plan',
  standfirst: 'You said you wanted your life in order this year.',
  caption: 'The wellness programme, in action. Photographed on location.',
  // Struck out, one after another.
  items: [
    'Wake at 5am, radiant, unprompted',
    'Gym six times a week',
    'Eat exclusively green things',
    'Build the CEO mindset',
    '10,000 steps a day',
  ],
  // The line that survives the pen.
  keep: 'Be loved exactly as you are',
  cue: 'tap it',
  // Written in the margin in red, after the striking.
  mark: 'not required',
  signoff: 'Nothing on that list is the price of anything.',
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
  title: 'What goes in it',
  standfirst: 'A year of us, in a pile. Flick through.',
  done: 'All of it goes in the bag.',
  doneBody:
    'Sixteen of us, and none of it takes up any room. You can carry the whole lot at once.',
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
  standfirst: 'Three cards, drawn for you. Turn them over.',
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
