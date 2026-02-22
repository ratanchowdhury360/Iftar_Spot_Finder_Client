// Item key = filename without extension in /public/Items/
export const IFTAR_ITEMS = [
  { key: 'kacchibiriyani', label: 'Kacchi Biriyani' },
  { key: 'tehari', label: 'Tehari' },
  { key: 'morogpolao', label: 'Morog Polao' },
  { key: 'gorurmangso', label: 'Gorur Mangso' },
  { key: 'budmuri', label: 'Bud Muri' },
  { key: 'chickenbiriyani', label: 'Chicken Biriyani' },
  { key: 'khasirbiriyani', label: 'Mixed Food' },
  { key: 'misro', label: 'Misro' },
  { key: 'others', label: 'Others' },
];

// Item keys that have their own image in /public/Items/
const ITEM_KEYS_WITH_IMAGE = [
  'kacchibiriyani',
  'tehari',
  'morogpolao',
  'gorurmangso',
  'budmuri',
  'chickenbiriyani',
  'khasirbiriyani',
  'misro',
];

// Returns image path: matching .png for known items, misro.png for custom/others.
export const getItemImageSrc = (itemKey) => {
  if (!itemKey) return '/Items/misro.png';
  const key = String(itemKey).toLowerCase().trim();
  if (ITEM_KEYS_WITH_IMAGE.includes(key)) return `/Items/${key}.png`;
  return '/Items/misro.png';
};

export const getItemLabel = (key) => IFTAR_ITEMS.find((i) => i.key === key)?.label || key;
