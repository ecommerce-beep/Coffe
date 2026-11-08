export const C = {
  blue: '#BCD7E6',
  cream: '#F8EADB',
  cherry: '#922F43',
  peach: '#F4ACA7',
  butter: '#F5C95C',
  espresso: '#47332E',
} as const;

export type ProductId = 'cherry' | 'sunny' | 'velvet';
export type FlavorId = 'cherry' | 'chocolate' | 'caramel' | 'honey' | 'nuts';

export interface Product {
  id: ProductId;
  name: [string, string];
  origin: string;
  process: string;
  notes: string[];
  description: string;
  mood: string;
  bag: { base: string; a: string; b: string; logo: string; label: string; ink: string };
  theme: { bg: string; text: string; accent: string; blobA: string; blobB: string; btn: 'cream' | 'default' | 'butter' };
  flavors: FlavorId[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'cherry',
    name: ['Cherry', 'Blossom'],
    origin: 'Ethiopia',
    process: 'Washed · Light roast',
    notes: ['Floral', 'Red berry', 'Honey'],
    description:
      'A bright, blooming cup from the Ethiopian highlands. Juicy red berries up front, a soft floral lift and a honeyed finish that lingers like a good compliment.',
    mood: 'For the hopeless romantics.',
    bag: { base: C.cherry, a: C.peach, b: C.cream, logo: C.cream, label: C.cream, ink: C.cherry },
    theme: { bg: C.peach, text: C.cherry, accent: C.cherry, blobA: C.cherry, blobB: C.cream, btn: 'default' },
    flavors: ['cherry', 'honey'],
  },
  {
    id: 'sunny',
    name: ['Sunny', 'Blend'],
    origin: 'Brazil-inspired blend',
    process: 'Natural · Medium roast',
    notes: ['Chocolate', 'Nuts', 'Caramel'],
    description:
      'Our everyday ray of sunshine. Cocoa-rich and nutty with a caramel hug — the blend that makes Monday mornings feel suspiciously like Saturday.',
    mood: 'For the morning people (and the converts).',
    bag: { base: C.blue, a: C.butter, b: C.cream, logo: C.cherry, label: C.cream, ink: C.cherry },
    theme: { bg: C.butter, text: C.espresso, accent: C.cherry, blobA: C.blue, blobB: C.cream, btn: 'default' },
    flavors: ['chocolate', 'nuts', 'caramel'],
  },
  {
    id: 'velvet',
    name: ['Velvet', 'Roast'],
    origin: 'Brazil',
    process: 'Pulped natural · Medium-dark',
    notes: ['Milk chocolate', 'Caramel', 'Smooth'],
    description:
      'Smooth as a slow Sunday. Milk chocolate and buttery caramel wrapped in a round, velvety body that loves milk just as much as you do.',
    mood: 'For the cosy, unhurried ones.',
    bag: { base: C.butter, a: C.cherry, b: C.cream, logo: C.cherry, label: C.cream, ink: C.cherry },
    theme: { bg: C.cherry, text: C.cream, accent: C.butter, blobA: C.peach, blobB: C.butter, btn: 'cream' },
    flavors: ['chocolate', 'caramel'],
  },
];

export interface Flavor {
  id: FlavorId;
  label: string;
  line: string;
  tint: string;
}

export const FLAVORS: Flavor[] = [
  { id: 'cherry', label: 'Cherry & Berries', line: 'Juicy, bright and a little bit cheeky. That red-fruit pop you taste first in every sip of Cherry Blossom.', tint: C.peach },
  { id: 'chocolate', label: 'Chocolate', line: 'Deep cocoa comfort. The backbone of our Brazilian coffees — rich, round and impossible to stay grumpy around.', tint: C.blue },
  { id: 'caramel', label: 'Caramel', line: 'Golden, buttery sweetness from a careful roast that coaxes the sugars out of every bean.', tint: C.butter },
  { id: 'honey', label: 'Honey', line: 'A soft, floral sweetness that lingers on the finish. Nature’s good-mood syrup.', tint: C.butter },
  { id: 'nuts', label: 'Nuts', line: 'Toasty hazelnut and almond warmth. The cosy sweater of flavor notes.', tint: C.peach },
];
