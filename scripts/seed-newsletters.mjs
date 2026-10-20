/**
 * Seed script — uploads all newsletter issues to Firestore.
 *
 * Run from the project root:
 *   node --env-file=.env scripts/seed-newsletters.mjs
 *
 * Each issue is written to the `newsletters` collection using its slug as the
 * document ID.  Re-running is safe — setDoc with merge:false replaces the doc.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ── Firebase config (reads from .env loaded via --env-file) ─────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Image constants (same as newsletters.ts) ────────────────────────────────
const IMG_FOREST      = 'https://www.figma.com/api/mcp/asset/72ce7357-a55e-425f-90ee-28cbab4dc95c';
const IMG_VENICE      = 'https://www.figma.com/api/mcp/asset/a31b5e7f-07e0-47d3-b7de-2b06e59dfebf';
const IMG_SAFARI      = 'https://www.figma.com/api/mcp/asset/a0e6aab9-87f8-4fce-bd65-7fb63e6c21b6';
const IMG_MOUNTAIN    = 'https://www.figma.com/api/mcp/asset/cf760b31-44ce-479b-bb13-8d991a84192f';
const IMG_HOTEL_COVER = 'https://www.figma.com/api/mcp/asset/377d47c7-65b9-4fdd-a162-144aa6c78e78';
const IMG_BORNEO      = 'https://www.figma.com/api/mcp/asset/fb545a25-304f-4762-b58f-5e2dd3e7ec43';
const IMG_LADAKH      = 'https://www.figma.com/api/mcp/asset/88e4b6a8-ab09-4ca9-bef4-b557ef9077b6';
const IMG_ATHENS      = 'https://www.figma.com/api/mcp/asset/219d4fbe-8af2-4360-8734-4a204fbb680e';

// ── Newsletter data ──────────────────────────────────────────────────────────
const newsletters = [
  {
    id: 'issue-05',
    slug: 'issue-05',
    issueNumber: 5,
    title: 'Roads Less Taken',
    description:
      "From painter Rose Wylie's breakout show and 16 months on the open ocean to transformation in Mayakoba, grounding in Brazil, and beyond.",
    accentColor: '#a66200',
    coverThumbnail: IMG_FOREST,
    heroImage: IMG_FOREST,
    editorLetterParagraphs: [
      "Some roads refuse to appear on any map. They surface in a stranger's offhand remark, in a wrong turn taken confidently, or in the pull of a place you can't quite explain to anyone who hasn't been there.",
      "This issue is dedicated to those roads -- the ones that diverge not just from the expected route, but from the expected version of yourself. Roads less taken aren't simply remote or difficult. They are the ones that ask something of you.",
      "We hope these stories unseat something. That they make you put down the itinerary, if only for a moment, and ask: what would happen if I went the other way?",
    ],
    pullQuote:
      "\" Some roads refuse to appear on any map. They surface in the pull of a place you can't quite explain to anyone who hasn't been there \"",
    editorName: 'Satarupa Datta',
    editorTitle: 'Founder | Editor',
    articles: [
      { id: 'a1', category: 'ADVENTURE + WILDLIFE', author: 'Ben Richards',   title: "A Craft Trail Around Japan's Saga Prefecture", image: IMG_FOREST  },
      { id: 'a2', category: 'TRAVEL + LIVING',      author: 'Priya Menon',    title: 'Sixteen Months on the Open Ocean',            image: IMG_VENICE  },
      { id: 'a3', category: 'WELLNESS',              author: 'Ananya Das',     title: 'Transformation in Mayakoba',                  image: IMG_SAFARI  },
      { id: 'a4', category: 'RETREATS',              author: 'Marcus Webb',    title: 'Grounding in the Brazilian Cerrado',          image: IMG_MOUNTAIN },
    ],
    publishedAt: '2026-03-01',
  },
  {
    id: 'issue-04',
    slug: 'issue-04',
    issueNumber: 4,
    title: 'The Places We Wander Off to',
    description:
      "From painter Rose Wylie's breakout show and 16 months on the open ocean to transformation in Mayakoba, grounding in Brazil, and beyond.",
    accentColor: '#c1adac',
    coverThumbnail: IMG_VENICE,
    heroImage: IMG_VENICE,
    editorLetterParagraphs: [
      'There is a particular kind of wandering that has nothing to do with being lost. It is deliberate, unhurried, and entirely without agenda -- the kind that leads you down a canal-side alley at dusk simply because the light looked interesting.',
      "This issue gathers stories from the places we wander off to when the official programme ends: the neighbourhood markets no guidebook has yet discovered, the villages that ask you to slow your pace to match theirs, the studio of an artist who doesn't take appointments.",
      'These are dispatches from the wandering hours. We hope they give you permission to get off the map.',
    ],
    pullQuote:
      '" There is a particular kind of wandering that has nothing to do with being lost -- it is deliberate, unhurried, and entirely without agenda "',
    editorName: 'Satarupa Datta',
    editorTitle: 'Founder | Editor',
    articles: [
      { id: 'a1', category: 'TRAVEL + LIVING', author: 'Divya Nair',    title: 'Venice After the Crowds Leave',            image: IMG_VENICE  },
      { id: 'a2', category: 'FOOD + DRINKS',   author: 'Kiran Bose',    title: 'A Market Walk Through Oaxaca',             image: IMG_FOREST  },
      { id: 'a3', category: 'CHANGEMAKER',     author: 'Leila Hassan',  title: 'The Artist Who Paints Only From Memory',  image: IMG_SAFARI  },
      { id: 'a4', category: 'WELLNESS',        author: 'Arun Varma',    title: 'On Slowing Down in the Dolomites',        image: IMG_MOUNTAIN },
    ],
    publishedAt: '2026-02-01',
  },
  {
    id: 'issue-03',
    slug: 'issue-03',
    issueNumber: 3,
    title: 'Postcards From Elsewhere',
    description:
      "From painter Rose Wylie's breakout show and 16 months on the open ocean to transformation in Mayakoba, grounding in Brazil, and beyond.",
    accentColor: '#a09f56',
    coverThumbnail: IMG_SAFARI,
    heroImage: IMG_SAFARI,
    editorLetterParagraphs: [
      "A postcard is the smallest possible story -- a fragment of place, compressed into a rectangle, sent to someone who wasn't there. We have always loved them for what they leave out as much as for what they say.",
      'This issue is a collection of postcards from elsewhere: short, vivid, specific. They arrive from a cattle ranch in Patagonia, a ferry crossing in the Aegean, a roadside teahouse on the Silk Road.',
      'We hope each one makes you wish you were there. And that the wishing turns, eventually, into going.',
    ],
    pullQuote:
      "\" A postcard is the smallest possible story -- a fragment of place, compressed into a rectangle, sent to someone who wasn't there \"",
    editorName: 'Satarupa Datta',
    editorTitle: 'Founder | Editor',
    articles: [
      { id: 'a1', category: 'ADVENTURE + WILDLIFE', author: 'Riyanka Roy',     title: 'On Safari in Amboseli: Beyond the Big Five',    image: IMG_SAFARI  },
      { id: 'a2', category: 'TRAVEL + LIVING',      author: 'Shreya Patel',    title: 'A Ferry Through the Greek Islands',             image: IMG_VENICE  },
      { id: 'a3', category: 'FOOD + DRINKS',        author: 'Omar Al-Rashid',  title: 'Tea Ceremonies Along the Silk Road',            image: IMG_FOREST  },
      { id: 'a4', category: 'RETREATS',             author: 'Camille Bernard', title: 'A Working Ranch in Patagonia',                  image: IMG_MOUNTAIN },
    ],
    publishedAt: '2026-01-01',
  },
  {
    id: 'issue-02',
    slug: 'issue-02',
    issueNumber: 2,
    title: 'Made Along The Way',
    description:
      "From painter Rose Wylie's breakout show and 16 months on the open ocean to transformation in Mayakoba, grounding in Brazil, and beyond.",
    accentColor: '#4c1620',
    coverThumbnail: IMG_MOUNTAIN,
    heroImage: IMG_MOUNTAIN,
    editorLetterParagraphs: [
      'The most interesting things about a journey are rarely planned. They are accumulated: a conversation on a night train, a recipe learned from a stranger, a skill practiced slowly in a workshop above a crowded souk.',
      'This issue is about what gets made along the way -- the objects, the friendships, the versions of ourselves that travel quietly assembles without us noticing.',
      'We think of every journey as a kind of craft. You begin rough and uncertain, and the road shapes you.',
    ],
    pullQuote:
      '" We think of every journey as a kind of craft. You begin rough and uncertain, and the road shapes you "',
    editorName: 'Satarupa Datta',
    editorTitle: 'Founder | Editor',
    articles: [
      { id: 'a1', category: 'TRAVEL + LIVING',      author: 'Tanvee Abhyankar', title: 'Learning to Weave in the Atlas Mountains',        image: IMG_MOUNTAIN },
      { id: 'a2', category: 'FOOD + DRINKS',        author: 'Yuki Tanaka',      title: "A Ramen Master's Apprentice",                     image: IMG_FOREST   },
      { id: 'a3', category: 'CHANGEMAKER',          author: 'Naledi Dlamini',   title: 'Craft Schools Saving a Dying Tradition',          image: IMG_SAFARI   },
      { id: 'a4', category: 'ADVENTURE + WILDLIFE', author: 'Sven Larsson',     title: 'Hand-Built and Seaworthy: A Voyage from Norway',  image: IMG_VENICE   },
    ],
    publishedAt: '2025-12-01',
  },
  {
    id: 'issue-01',
    slug: 'issue-01',
    issueNumber: 1,
    title: 'The Mindful Traveller',
    description:
      "From painter Rose Wylie's breakout show and 16 months on the open ocean to transformation in Mayakoba, grounding in Brazil, and beyond.",
    accentColor: '#007aa6',
    coverThumbnail: IMG_FOREST,
    heroImage: IMG_HOTEL_COVER,
    editorLetterParagraphs: [
      "When I travelled to Cappadocia in 2025, I noticed the near-obsession with hot air balloons. Every morning, long before dawn, travellers wake up to catch the first ascent, hoping to witness the sunrise spectacle that floats above Cappadocia's surreal, sculpted terrain.",
      "But instead of joining the sky-bound frenzy, I decided to step away from it and take a quieter, craft-led detour to Avanos, Cappadocia's ancient pottery town.",
      "I visited one of the region's largest family-run pottery studios for a private tour that introduced a craft passed down through generations. Watching master artisans shape vessels by hand using the mineral-rich red clay drawn from the Kizilirmak River revealed something deeper, a living expression of a craft culture that traces its lineage back to the Hittites.",
      "Later, at the Museum Hotel, I found myself immersed in another layer of the region's heritage. Cave suites built on prehistoric caves hewn directly from the rock, displaying an intimate glimpse into Cappadocia's ancient cave architecture -- a reminder that the land has always served as a refuge, shaped slowly by human hands.",
      "The kind that goes beyond the Instagram algorithms that 'flatten' our culture, deciding upon what we see, hear, and feel.",
      "As we launch Travel Handmade, we put together our inaugural issue that embraces the growing movement toward conscious travel -- journeys that honour people, place, and planet, and experiences that build deeper connections with local communities and landscapes. Now, more than ever, the world needs the right traveller. We call them the \"Mindful Traveller\".",
      "In Amboseli, our supervising editor Riyanka Roy follows the footsteps of a Maasai guide to uncover what truly defines the quintessential African safari. Our seasoned writer, Tanvee Abhyankar, takes a sabbatical in Ladakh, spending weeks in Turtuk, opening herself up to its culture through a thoughtfully curated culture walk across the village. Virender Singh leads us through Athens, tracing how the historic city is re-emerging as one of Europe's most dynamic contemporary art capitals. And Sinchita Sinha ventures deep into the rainforests of Malaysian Borneo on a night walking safari, where darkness reveals a world most travellers never encounter.",
      'Consider this first issue an invitation, a guide to travelling more consciously and respectfully. One handmade journey at a time.',
      'Cheers!',
    ],
    pullQuoteAfterIndex: 4,
    pullQuote:
      '" This moment stayed with me. It reflected the kind of travel experience that urges to slow down, look closer, and connect more meaningfully with a place "',
    editorName: 'Satarupa Datta',
    editorTitle: 'Founder | Editor',
    articles: [
      { id: 'a1', category: 'TRAVEL + LIVING',      author: 'Tanvee Abhyankar', title: 'Turtuk, On Its Own Terms',                                          image: IMG_LADAKH,  articleSlug: '' },
      { id: 'a2', category: 'TRAVEL + LIVING',      author: 'Virender Singh',   title: "A Cultural Guide to Athens: The City's Creative Revival",            image: IMG_ATHENS,  articleSlug: '' },
      { id: 'a3', category: 'ADVENTURE + WILDLIFE', author: 'Riyanka Roy',      title: "Why Amboseli National Park is Becoming A Traveller's Favourite",     image: IMG_SAFARI,  articleSlug: '' },
      { id: 'a4', category: 'ADVENTURE + WILDLIFE', author: 'Sinchita Sinha',   title: 'I Took A Night Walking Tour in the Jungles of Borneo',               image: IMG_BORNEO,  articleSlug: '' },
    ],
    publishedAt: '2025-11-01',
  },
];

// ── Upload ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`Uploading ${newsletters.length} newsletter issues to Firestore...\n`);

  for (const issue of newsletters) {
    const ref = doc(db, 'newsletters', issue.slug);
    await setDoc(ref, issue);
    console.log(`  ✓  ${issue.slug}  —  ${issue.title}`);
  }

  console.log('\nDone. All issues written to the `newsletters` collection.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
