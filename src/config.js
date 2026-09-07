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
  issueDate: 'September 2026',
  edition: 'Special birthday edition',
  // Printed down the left of the cover, magazine style.
  coverLines: ['The year in review', 'Tarot reading', 'Special sections'],
  // For her access pass on the entry page. Keep it short and funny.
  occupation: 'CEO',
  // Printed along the foot of the pass.
  passStatus: 'Trial adulting',

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
    bagShots: ['photos/bag.png', 'photos/bag/01.png', 'photos/bag/02.png', 'photos/bag-open.png'],
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

    introTitle: 'This one.',
    introBody: 'The one you kept going back to look at. It is not a browser tab any more.',
    // It has been ordered but has not landed yet, so the page says so.
    status: "It's on its way",
    task: 'Try it on',
    // The instruction once she is on the drag itself.
    dragHint: 'Drag it onto her shoulder',

    // After it lands on the glossy shot: the joke, and the wipe.
    oopsTitle: 'Hm. Too much.',
    oopsBody: 'Hold on, that is the version for the magazine.',
    oopsCue: 'wipe it clear, closer to reality',

    title: 'There she is.',
    body: 'Matches the crocs.',
  },

  // --- Gift two: the massage voucher (scratch to reveal) ---
  voucher: {
    place: 'THAIco SPA',
    treatment: 'Gift card',
    validUntil: '6 March 2027',
    // The card itself is downloadable from the page, so the code is shown in
    // full: masking it while the file that contains it is one tap away would
    // only look like security. The repo is public and the certificate is
    // transferable, and that trade was made deliberately.
    //code: '47C39-43CD2',
    pdf: 'voucher.pdf',
    site: 'thaicospa.ro',
    openLabel: 'Open the voucher',

    // --- Why this gift, before the reveal. Edit freely, this is the sincere bit. ---
    noteTitle: 'You work too hard.',
    noteBody:
      'We have watched you go all year. You answer at midnight, you show up when you have nothing left, you carry everyone. We would like to see you horizontal for once, doing nothing, on purpose.',
    // Printed under the photograph, in the voice of a real advertorial.
    caption: 'Exhibit A.',

    // --- The petition. Sixteen signatures, then a stamp. ---
    petitionTitle: 'A petition',
    petitionDemand:
      'lie down for sixty consecutive minutes, phone in another room, answering to nobody',
    petitionStamp: 'Granted',
    petitionNote: 'Signed by everyone below, and non-negotiable.',
  },

  // --- Sign-off ---
  // 'Masthead' is magazine jargon for the page listing everyone who made the
  // issue. Nobody reading this owes us that word, so both labels say it plainly.
  closingKicker: 'Who made this',
  // Plays on the last page, muted and looping.
  closingVideo: 'video/closing.mp4',
  closingPoster: 'video/closing.jpg',
}

// ============================================================
//  THE SECTION DIVIDERS
//  The page that introduces each gift. Keep it to a few words: it is
//  a breath, not a paragraph.
// ============================================================
export const DIVIDERS = {
  gift1: {
    kicker: 'Presents',
    numeral: 'I',
    title: 'Your first present',
    note: 'The one you can carry',
  },
  gift2: {
    kicker: 'Presents',
    numeral: 'II',
    title: 'Your second present',
    note: 'The one you have to book',
  },
}

// ============================================================
//  THE 28-DAY PLAN
//  Her wish this year was to get fit and put her life in order. One
//  tap crosses that programme off, and a different list writes itself
//  in its place: not "you do not need any of this" but "here is what
//  we would wish for you instead". The reward is something arriving.
//
//  TODO the five lines in `ours` are the ones to write yourselves.
//  They are the actual gift on this page.
// ============================================================
export const PLAN = {
  // The list is her own birthday wishes, so the page is framed as the review
  // of the year in which she was going to do them.
  title: 'Year in Review',
  standfirst:
    'We know all you wanted for your birthday this year was to get fit, put your life in order and other Virgo-like wishes.',
  items: [
    'Wake at 5am, radiant, unprompted',
    'Gym six times a week',
    'Eat exclusively green things',
    'Build the CEO mindset',
    '10,000 steps a day',
  ],
  cue: 'tap the list',

  // TODO YOURS. These lines are the gift on this page and they have to come
  // from you: written by me they read as somebody impersonating your group.
  // Any number of them works, and the page skips this block if it is empty.
  ours: [],
  // The last line, given its own weight and underlined in red.
  finalWish: 'Be loved exactly as you are',
  finalNote: 'That one is already done.',
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
export const PEOPLE = [
  'Andrica',
  'Alex',
  'Lupino',
  'Paul',
  'Andrada',
  'Laur',
  'Irina',
  'Florin',
  'Alina',
  'Boros',
  'Mihai Petre',
  'Alexandra',
  'Zoire',
  'Fratello',
  'Manu',
  'Elvis',
]

// ============================================================
//  THE MEMORIES
//  The photographs in the pile, kept separate from the names above:
//  these are group shots, so putting one name on one of them asks
//  which of the four people in it that is. The names do their work
//  on the petition and the masthead instead.
//
//  Add a photograph by dropping it in public/photos/people/ as the
//  next number and adding a line here. `caption` is optional: give
//  it the occasion, not a name, and leave it out for no caption.
// ============================================================
export const MEMORIES = [
  { photo: 'photos/people/01.jpg', focus: 'center 35%' },
  { photo: 'photos/people/02.jpg', focus: 'center 35%' },
  { photo: 'photos/people/03.jpg', focus: 'center 35%' },
  { photo: 'photos/people/04.jpg', focus: 'center 35%' },
  { photo: 'photos/people/05.jpg', focus: 'center 35%' },
  { photo: 'photos/people/06.jpg', focus: 'center 35%' },
  { photo: 'photos/people/07.jpg', focus: 'center 35%' },
  { photo: 'photos/people/08.jpg', focus: 'center 35%' },
  // A clip rather than a still: it plays while it is the card on top.
  { photo: 'photos/people/09.jpg', video: 'video/memory-09.mp4', focus: 'center 35%' },
  { photo: 'photos/people/10.jpg', focus: 'center 30%' },
  { photo: 'photos/people/11.jpg', focus: 'center 30%' },
  { photo: 'photos/people/12.jpg', focus: 'center 40%' },
  { photo: 'photos/people/13.jpg', focus: 'center 35%' },
  { photo: 'photos/people/14.jpg', focus: 'center 35%' },
]

export const PACK = {
  // Step one: the bag, empty.
  emptyTitle: 'It is empty.',
  emptyCta: 'Fill the bag with us',
  // Step two: the deck.
  title: 'Filling the bag with our memories together',
  // Step three: in it goes.
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
  title: 'Your Year Ahead',
  standfirst:
    'We know we are not a witch in the Amazonian forest, but we think we can see the future pretty clearly.',
  cue: 'turn it over',
  drawCue: 'draw one',
  // Spares, already prepared: photos/tarot/star.jpg and world.jpg. Swap either
  // in by changing a card's name, image and reading below.
  cards: [
    {
      position: 'Where you are',
      name: 'Strength',
      image: 'photos/tarot/strength.jpg',
      reading:
        'Endless strength, and the year you stop apologising for taking up space. Certified bad bitch, filed under fact, not opinion.',
    },
    {
      position: 'What carries you',
      name: 'The Empress',
      image: 'photos/tarot/empress.jpg',
      reading:
        'Startup founder energy. Your name on the thing, your terms, your table. A Sex and the City kind of year, and the friends are already cast.',
    },
    {
      position: 'What is coming',
      name: 'The Sun',
      image: 'photos/tarot/sun.jpg',
      reading:
        'Adored, loudly, all year. Endless love, from us and from people who have not even met you yet.',
    },
  ],
  bonus: {
    position: 'Uninvited',
    name: 'The Finger',
    image: 'photos/tarot/finger.jpg',
    intro: 'The deck insisted on one more.',
    reading:
      'For anyone giving bad vibes this year. Drawn on your behalf.',
  },
}
