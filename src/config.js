// ============================================================
//  PERSONALISE EVERYTHING HERE  ·  edit, save, done.
//  Anything marked TODO is a placeholder and will look like one.
// ============================================================

export const CONFIG = {
  // --- Her ---
  name: 'NAME HERE',        // TODO shown large on the cover
  age: 28,
  magazineName: 'BESTIE',   // TODO the title on the cover
  issueLabel: 'ISSUE 28',
  coverLine: 'Twenty-eight. Two gifts. Sixteen of us.',  // TODO one line under her name
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
  },

  // Where the mouth of the open bag sits, as percentages of that photo.
  // A wish dropped inside this circle goes in. Generous on purpose.
  bagMouth: { x: 46, y: 55, r: 30 },

  // --- Where the bag has to land (the cover shoot) ---
  // Percentages of the photo frame. Open the page with `npm run dev` and drag
  // the bag around: a readout under it prints the coordinates. Copy them here.
  bagTarget: {
    x: 62,          // TODO % from left
    y: 40,          // TODO % from top
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
//  THE SIXTEEN WISHES
//  This is the heart of it, and the only part I cannot write for you.
//  One line per person: what they wish for her twenty-eighth year.
//  She drags each one into the bag, so keep them short, a sentence or
//  two, the length you would actually say out loud.
//  TODO replace all sixteen.
// ============================================================
export const WISHES = [
  { name: 'Person 1', wish: 'Their wish for her goes here.' },
  { name: 'Person 2', wish: 'Their wish for her goes here.' },
  { name: 'Person 3', wish: 'Their wish for her goes here.' },
  { name: 'Person 4', wish: 'Their wish for her goes here.' },
  { name: 'Person 5', wish: 'Their wish for her goes here.' },
  { name: 'Person 6', wish: 'Their wish for her goes here.' },
  { name: 'Person 7', wish: 'Their wish for her goes here.' },
  { name: 'Person 8', wish: 'Their wish for her goes here.' },
  { name: 'Person 9', wish: 'Their wish for her goes here.' },
  { name: 'Person 10', wish: 'Their wish for her goes here.' },
  { name: 'Person 11', wish: 'Their wish for her goes here.' },
  { name: 'Person 12', wish: 'Their wish for her goes here.' },
  { name: 'Person 13', wish: 'Their wish for her goes here.' },
  { name: 'Person 14', wish: 'Their wish for her goes here.' },
  { name: 'Person 15', wish: 'Their wish for her goes here.' },
  { name: 'Person 16', wish: 'Their wish for her goes here.' },
]

export const PACK = {
  title: 'What we are putting in your bag',
  standfirst:
    'Sixteen of us wrote you one. Drag each one into the bag. Nothing in here takes up any room.',
  done: 'The bag is full.',
  doneBody: 'Sixteen wishes, no receipts. You can carry all of it at once.',
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
