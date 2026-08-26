/* CoreSkillAI - language registry.
   ONE place to add a market. main.js builds the <select> from this, so the
   76 HTML pages never need editing when a language is added. Endonyms are
   used deliberately: flags are countries, not languages, and Windows has no
   flag glyphs at all - they rendered as "us"/"es". */
// `ready: true` means this market has real pages on disk. The selector only
// offers ready languages, so a translated-but-not-yet-generated language can
// never produce a 404 in the dropdown.
window.LANGS = {
  af: { name: "Afrikaans", dir: "ltr" },
  id: { name: "Bahasa Indonesia", dir: "ltr" },
  ms: { name: "Bahasa Melayu", dir: "ltr" },
  cs: { name: "Čeština", dir: "ltr" },
  da: { name: "Dansk", dir: "ltr" },
  de: { name: "Deutsch", dir: "ltr", ready: true },
  et: { name: "Eesti", dir: "ltr" },
  en: { name: "English", dir: "ltr", ready: true },
  es: { name: "Español", dir: "ltr", ready: true },
  fr: { name: "Français", dir: "ltr", ready: true },
  hr: { name: "Hrvatski", dir: "ltr" },
  it: { name: "Italiano", dir: "ltr", ready: true },
  sw: { name: "Kiswahili", dir: "ltr" },
  lv: { name: "Latviešu", dir: "ltr" },
  lt: { name: "Lietuvių", dir: "ltr" },
  hu: { name: "Magyar", dir: "ltr" },
  nl: { name: "Nederlands", dir: "ltr", ready: true },
  no: { name: "Norsk", dir: "ltr" },
  pl: { name: "Polski", dir: "ltr", ready: true },
  pt: { name: "Português", dir: "ltr", ready: true },
  ro: { name: "Română", dir: "ltr" },
  sq: { name: "Shqip", dir: "ltr" },
  sk: { name: "Slovenčina", dir: "ltr" },
  sl: { name: "Slovenščina", dir: "ltr" },
  fi: { name: "Suomi", dir: "ltr" },
  sv: { name: "Svenska", dir: "ltr" },
  tl: { name: "Tagalog", dir: "ltr" },
  vi: { name: "Tiếng Việt", dir: "ltr" },
  tr: { name: "Türkçe", dir: "ltr" },
  el: { name: "Ελληνικά", dir: "ltr" },
  bg: { name: "Български", dir: "ltr" },
  mk: { name: "Македонски", dir: "ltr" },
  ru: { name: "Русский", dir: "ltr" },
  sr: { name: "Српски", dir: "ltr" },
  uk: { name: "Українська", dir: "ltr" },
  he: { name: "עברית", dir: "rtl" },
  ar: { name: "العربية", dir: "rtl" },
  fa: { name: "فارسی", dir: "rtl" },
  hi: { name: "हिन्दी", dir: "ltr" },
  th: { name: "ไทย", dir: "ltr" },
  zh: { name: "中文", dir: "ltr" },
  ja: { name: "日本語", dir: "ltr" },
  ko: { name: "한국어", dir: "ltr" },
};
