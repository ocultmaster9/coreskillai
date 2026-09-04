/* CoreSkillAI - language registry.
   ONE place to add a market. main.js builds the <select> from this, so the
   76 HTML pages never need editing when a language is added. Endonyms are
   used deliberately: flags are countries, not languages, and Windows has no
   flag glyphs at all - they rendered as "us"/"es". */
// `ready: true` means this market has real pages on disk. The selector only
// offers ready languages, so a translated-but-not-yet-generated language can
// never produce a 404 in the dropdown.
window.LANGS = {
  af: { name: "Afrikaans", dir: "ltr", ready: true },
  id: { name: "Bahasa Indonesia", dir: "ltr", ready: true },
  ms: { name: "Bahasa Melayu", dir: "ltr", ready: true },
  cs: { name: "Čeština", dir: "ltr", ready: true },
  da: { name: "Dansk", dir: "ltr", ready: true },
  de: { name: "Deutsch", dir: "ltr", ready: true },
  et: { name: "Eesti", dir: "ltr", ready: true },
  en: { name: "English", dir: "ltr", ready: true },
  es: { name: "Español", dir: "ltr", ready: true },
  fr: { name: "Français", dir: "ltr", ready: true },
  hr: { name: "Hrvatski", dir: "ltr", ready: true },
  it: { name: "Italiano", dir: "ltr", ready: true },
  sw: { name: "Kiswahili", dir: "ltr", ready: true },
  lv: { name: "Latviešu", dir: "ltr", ready: true },
  lt: { name: "Lietuvių", dir: "ltr", ready: true },
  hu: { name: "Magyar", dir: "ltr", ready: true },
  nl: { name: "Nederlands", dir: "ltr", ready: true },
  no: { name: "Norsk", dir: "ltr", ready: true },
  pl: { name: "Polski", dir: "ltr", ready: true },
  pt: { name: "Português", dir: "ltr", ready: true },
  ro: { name: "Română", dir: "ltr", ready: true },
  sq: { name: "Shqip", dir: "ltr", ready: true },
  sk: { name: "Slovenčina", dir: "ltr", ready: true },
  sl: { name: "Slovenščina", dir: "ltr", ready: true },
  fi: { name: "Suomi", dir: "ltr", ready: true },
  sv: { name: "Svenska", dir: "ltr", ready: true },
  tl: { name: "Tagalog", dir: "ltr", ready: true },
  vi: { name: "Tiếng Việt", dir: "ltr", ready: true },
  tr: { name: "Türkçe", dir: "ltr", ready: true },
  el: { name: "Ελληνικά", dir: "ltr", ready: true },
  bg: { name: "Български", dir: "ltr", ready: true },
  mk: { name: "Македонски", dir: "ltr", ready: true },
  ru: { name: "Русский", dir: "ltr", ready: true },
  sr: { name: "Српски", dir: "ltr", ready: true },
  uk: { name: "Українська", dir: "ltr", ready: true },
  he: { name: "עברית", dir: "rtl", ready: true },
  ar: { name: "العربية", dir: "rtl", ready: true },
  fa: { name: "فارسی", dir: "rtl", ready: true },
  hi: { name: "हिन्दी", dir: "ltr", ready: true },
  th: { name: "ไทย", dir: "ltr", ready: true },
  zh: { name: "中文", dir: "ltr", ready: true },
  ja: { name: "日本語", dir: "ltr", ready: true },
  ko: { name: "한국어", dir: "ltr", ready: true },
};
