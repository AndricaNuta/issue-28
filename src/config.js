// ============================================================
//  PERSONALISE EVERYTHING HERE  ·  edit, save, done.
//  Anything marked TODO is a placeholder and will look like one.
// ============================================================

export const CONFIG = {
  // --- Her ---
  name: 'Ana',
  age: 28,
  magazineName: 'BESTIE',   // TODO the title on the cover
  issueLabel: 'ISSUE 28',
  // A short script line above her name on the cover. '' hides it.
  coverKicker: 'cover star',
  issueDate: 'Birthday issue 2026',
  edition: 'Special edition',
  // Printed down the left of the cover, magazine style.
  coverLines: ["What's in her bag?", 'The 28-day plan', 'Your year ahead'],
  // For her access pass on the entry page. Keep it short and funny.
  occupation: 'Birthday girl',   // TODO

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

  // --- Gift one: the bag ---
  bag: {
    introTitle: 'The cover is not finished.',
    introBody:
      'There is something missing from the shot. It belongs to you, and it belongs on your shoulder. Put it there and the cover is done.',
    task: 'Drag the bag onto her shoulder',
    title: 'It is yours.',
    body: 'All sixteen of us went in on it. Put it on a real shoulder and go be insufferable about it.',
  },

  // --- Gift two: the massage voucher (scratch to reveal) ---
  voucher: {
    place: 'PLACE HERE',            // TODO spa or salon
    treatment: 'Full body massage', // TODO
    duration: '60 minutes',         // TODO
    validUntil: '',                 // TODO e.g. '31 March 2027'. '' hides it.
    code: '',                       // TODO voucher code. '' hides it.
    note: 'The only part of the wellness plan that is compulsory.',
    // Printed under the photograph, in the voice of a real advertorial.
    caption: 'Our model, mid-treatment. Results as pictured.',
  },

  // --- Sign-off ---
  closing: 'Happy 28th. Same time next issue.',
}

// ============================================================
//  THE 28-DAY PLAN
//  Her actual birthday wish this year: life in order, clean eating,
//  the gym, the CEO morning. She ticks these off. The last one is
//  already ticked and cannot be un-ticked. That is the point.
//  Edit these lines freely, they should sound like your group.
// ============================================================
export const PLAN = {
  title: 'The 28-Day Plan',
  standfirst:
    'You said you wanted your life in order this year. Clean eating, the gym, the CEO morning. Here is the programme.',
  items: [
    { text: 'Wake at 5am, radiant, unprompted', quip: 'Filed under fiction.' },
    { text: 'Gym six times a week', quip: 'We will come twice and complain throughout.' },
    { text: 'Eat exclusively green things', quip: 'Pistachio gelato is green. We checked.' },
    { text: 'Build the CEO mindset', quip: 'You already run sixteen people. That is a company.' },
    { text: '10,000 steps a day', quip: 'Shopping counts. Non-negotiable.' },
    { text: 'Be loved exactly as you are', quip: 'Completed 28 years ago. Cannot be undone.', locked: true },
  ],
  payoff: {
    title: 'Here is your wish, granted.',
    body:
      'Get fit, eat clean, run the empire, we will be there for all of it. But none of it is the price of anything. You are not a project to be finished. Nothing on that list makes you more loved than you already were.',
  },
}

// ============================================================
//  THE SIXTEEN
//  A polaroid each. `photo` is a file in public/photos/people/,
//  `wish` is what they wish her for the year, shown when she drops
//  their polaroid into the bag.
//  Drop the photos into ~/Downloads/people/ and run:
//      python3 scripts/people.py ~/Downloads/people
//  which squares, shrinks and numbers them into public/photos/people/.
//  TODO replace all sixteen names and wishes.
// ============================================================
export const WISHES = Array.from({ length: 16 }, (_, i) => ({
  name: `Person ${i + 1}`,
  wish: 'Their wish for her goes here.',
  photo: `photos/people/${String(i + 1).padStart(2, '0')}.jpg`,
}))

export const PACK = {
  title: 'Now fill it',
  standfirst:
    'Sixteen of us, and a wish each. Put us in the bag. None of it takes up any room.',
  done: 'The bag is full.',
  doneBody: 'Sixteen of us in there, no receipts. You can carry all of it at once.',
}

// ============================================================
//  YOUR YEAR AHEAD
//  Three cards she turns over. Deliberately about the year, not about
//  her personality, so nothing here can land wrong.
// ============================================================
export const YEAR = {
  title: 'Your Year Ahead',
  standfirst: 'Three predictions. Our record is excellent and cannot be verified.',
  cards: [
    { label: 'Spring', text: 'You finally book the thing you keep almost booking.' },
    { label: 'Summer', text: 'A photograph of you from this year becomes the one everyone uses.' },
    { label: 'Autumn', text: 'Something you have been carrying quietly gets easier, and you notice on an ordinary Tuesday.' },
  ],
}
