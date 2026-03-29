const WORD_TO_NUM: Record<string, number> = {
  zero: 0,
  um: 1, uma: 1,
  dois: 2, duas: 2,
  três: 3, tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14, catorze: 14,
  quinze: 15,
  dezesseis: 16, dezasseis: 16,
  dezessete: 17, dezassete: 17,
  dezoito: 18,
  dezenove: 19, dezanove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100, cento: 100,
  duzentos: 200, duzentas: 200,
  trezentos: 300, trezentas: 300,
  quatrocentos: 400, quatrocentas: 400,
  quinhentos: 500, quinhentas: 500,
  seiscentos: 600, seiscentas: 600,
  setecentos: 700, setecentas: 700,
  oitocentos: 800, oitocentas: 800,
  novecentos: 900, novecentas: 900,
};

/**
 * Converts a Portuguese number phrase into a number.
 * Handles digits, single words, and compound forms like "vinte e cinco" or "noventa e nove".
 */
function wordToNumber(text: string): number | null {
  const t = text.toLowerCase().trim();

  // Pure digit string (may have comma or dot as decimal)
  if (/^[\d]+([.,]\d{1,2})?$/.test(t)) {
    return parseFloat(t.replace(",", "."));
  }

  // Direct single-word lookup
  if (WORD_TO_NUM[t] !== undefined) return WORD_TO_NUM[t];

  // Compound: split by " e " and sum parts (works for Portuguese number structure)
  // e.g. "noventa e nove" → 90 + 9 = 99, "duzentos e vinte e cinco" → 200 + 20 + 5 = 225
  const parts = t.split(/\s+e\s+/);
  let total = 0;
  for (const part of parts) {
    const val = WORD_TO_NUM[part.trim()];
    if (val === undefined) return null;
    total += val;
  }
  return total;
}

/**
 * Parses a spoken price phrase in Brazilian Portuguese into a float.
 *
 * Supported patterns (examples):
 *   "dois reais e cinquenta centavos" → 2.50
 *   "dois reais e cinquenta"          → 2.50
 *   "dois e cinquenta"                → 2.50  (implicit "reais e")
 *   "três vírgula noventa"            → 3.90
 *   "vinte e cinco reais"             → 25.00
 *   "8,99" / "8.99"                   → 8.99
 *
 * Returns null if the phrase cannot be interpreted as a price.
 */
export function parsePriceFromSpeech(text: string): number | null {
  const t = text.toLowerCase().trim();

  // Already a number: "8.99", "8,99", "25"
  if (/^[\d]+([.,]\d{1,2})?$/.test(t)) {
    return parseFloat(t.replace(",", "."));
  }

  // "X reais e Y centavos"
  let m = t.match(/^(.+?)\s+reais?\s+e\s+(.+?)\s+centavos?\.?$/);
  if (m) {
    const r = wordToNumber(m[1]);
    const c = wordToNumber(m[2]);
    if (r !== null && c !== null) return r + c / 100;
  }

  // "X reais e Y" (implicit centavos)
  m = t.match(/^(.+?)\s+reais?\s+e\s+(.+)$/);
  if (m) {
    const r = wordToNumber(m[1]);
    const c = wordToNumber(m[2]);
    if (r !== null && c !== null) return r + c / 100;
  }

  // "X vírgula Y"
  m = t.match(/^(.+?)\s*vírgula\s*(.+)$/);
  if (m) {
    const r = wordToNumber(m[1]);
    const c = wordToNumber(m[2]);
    if (r !== null && c !== null) return r + c / 100;
  }

  // "X reais" (no cents)
  m = t.match(/^(.+?)\s+reais?\.?$/);
  if (m) {
    const r = wordToNumber(m[1]);
    if (r !== null) return r;
  }

  // "X e Y" → X reais e Y centavos (shorthand, e.g. "dois e cinquenta")
  m = t.match(/^(\w+)\s+e\s+(\w+)$/);
  if (m) {
    const r = wordToNumber(m[1]);
    const c = wordToNumber(m[2]);
    if (r !== null && c !== null && c < 100) return r + c / 100;
  }

  // Last resort: treat the whole phrase as a plain number (reais only)
  return wordToNumber(t);
}
