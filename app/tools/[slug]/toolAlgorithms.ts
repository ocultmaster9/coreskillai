// Tool algorithms shared between server and client components

export function runTaxRefund(form: Record<string, string>): Record<string, string> {
  const income = parseFloat(form.income || '0');
  const withheld = parseFloat(form.withheld || '0');
  const dependents = parseInt(form.dependents || '0');
  const isItemized = form.deductions === 'itemized';
  const itemizedAmount = parseFloat(form.itemizedAmount || '0');
  const standardDeduction = 14600;
  const taxable = Math.max(0, income - (isItemized ? itemizedAmount : standardDeduction) - dependents * 2000);
  let tax = 0;
  if (taxable > 0) {
    const brackets = [
      { up: 11600, rate: 0.10 },
      { up: 47150, rate: 0.12 },
      { up: 100525, rate: 0.22 },
      { up: 191950, rate: 0.24 },
      { up: 243725, rate: 0.32 },
      { up: 609350, rate: 0.35 },
      { up: Infinity, rate: 0.37 },
    ];
    let prev = 0;
    for (const b of brackets) {
      const taxableBracket = Math.min(taxable, b.up) - prev;
      if (taxableBracket <= 0) break;
      tax += taxableBracket * b.rate;
      prev = b.up;
    }
  }
  const refund = Math.max(0, withheld - tax);
  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
  return {
    estimatedRefund: `$${refund.toFixed(2)}`,
    effectiveRate: `${effectiveRate.toFixed(1)}%`,
    taxOwed: `$${tax.toFixed(2)}`,
  };
}

export function runUnscramble(form: Record<string, string>): Record<string, string> {
  const letters = (form.letters || '').toUpperCase().replace(/[^A-Z]/g, '');
  const minLen = parseInt(form.minLength || '2');
  const startsWith = (form.startsWith || '').toUpperCase();
  const contains = (form.contains || '').toUpperCase();
  if (!letters) return { words: '<p class="text-gray-400">Enter letters above</p>', wordCount: '0' };
  const dictionary: Record<number, string[]> = {
    2: ['TO', 'IN', 'IT', 'IS', 'AT', 'AS', 'ON', 'AN', 'BE', 'WE', 'ME', 'HE', 'US', 'UP', 'DO', 'GO', 'NO', 'SO', 'IF', 'MY'],
    3: ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS'],
    4: ['THAT', 'WITH', 'HAVE', 'THIS', 'WILL', 'YOUR', 'FROM', 'THEY', 'WHAT', 'WORK', 'FIRST', 'GOOD', 'EVER', 'MORE', 'WHEN', 'SOME'],
    5: ['THEIR', 'WOULD', 'THERE', 'THESE', 'THING', 'THINK', 'ABOUT', 'WHICH', 'AFTER', 'COULD', 'OTHER', 'THOSE', 'YEARS'],
    6: ['SYSTEM', 'THROUGH', 'BEING', 'UNDER', 'WHILE', 'WHERE', 'EVERY', 'ALWAYS', 'ANSWER'],
    7: ['NETWORK', 'PRODUCT', 'BETWEEN', 'THOUGHT', 'PROBLEM', 'PEOPLE', 'DURING', 'FURTHER', 'AGAINST'],
    8: ['ALGORITHM', 'BUSINESS', 'CHARACTER', 'CONDITION', 'DEVELOP', 'ECONOMIC', 'FINISHED', 'GENERAL'],
  };
  const results: string[] = [];
  const len = letters.length;
  for (let l = minLen; l <= len; l++) {
    const words = dictionary[l] || [];
    for (const w of words) {
      if (w.length > len) continue;
      const avail = letters.split('');
      let match = true;
      for (const c of w.split('').sort()) {
        const idx = avail.indexOf(c);
        if (idx === -1) { match = false; break; }
        avail.splice(idx, 1);
      }
      if (!match) continue;
      if (startsWith && !w.startsWith(startsWith)) continue;
      if (contains && !w.includes(contains)) continue;
      results.push(w);
    }
  }
  if (results.length === 0) {
    return { words: '<p class="text-gray-400">No words found. Try different letters or shorter min length.</p>', wordCount: '0' };
  }
  const html = `<div class="flex flex-wrap gap-2">${results.map(w => `<span class="px-3 py-1.5 bg-dark-700 rounded-lg text-sm font-mono text-brand-300 border border-brand-500/20">${w}</span>`).join('')}</div>`;
  return { words: html, wordCount: String(results.length) };
}

export function runWordCounter(form: Record<string, string>): Record<string, string> {
  const text = form.text || '';
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+/g) || []).length || (text.length > 0 ? 1 : 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length || (text.length > 0 ? 1 : 0);
  const readingTime = Math.ceil(words.length / 200);
  const speakingTime = Math.ceil(words.length / 150);
  return {
    wordCount: String(words.length),
    charCount: `${chars} (${charsNoSpaces} without spaces)`,
    sentenceCount: String(sentences),
    paragraphCount: String(paragraphs),
    readingTime: `~${readingTime} min read`,
    speakingTime: `~${speakingTime} min speak`,
  };
}

export function runHashtagGenerator(form: Record<string, string>): Record<string, string> {
  const topic = form.topic || '';
  const platform = form.platform || 'instagram';
  const count = parseInt(form.count || '10');
  const words = topic.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const templates: Record<string, string[][]> = {
    instagram: [['ai', 'automation', 'productivity', 'tech', 'future', 'innovation', 'digital', 'tools'], ['#AI']],
    twitter: [['#AI', '#Tech', '#Innovation', '#Productivity', '#Automation'], ['#' + (words[0] || 'AI')]],
    linkedin: [['#AI', '#Technology', '#Innovation', '#ProfessionalDevelopment'], ['#' + (words[0] || 'AI')]],
    tiktok: [['#fyp', '#foryou', '#ai', '#tech', '#viral', '#trending'], ['#ai' + (words[0] || 'tool')]],
    all: [['#AI', '#automation', '#productivity', '#tech', '#tools', '#digital', '#innovation', '#future'], ['#' + (words[0] || 'AI')]],
  };
  const sets = templates[platform] || templates.all;
  const all = [...sets[0], ...sets[1]].slice(0, count);
  return {
    hashtags: `<div class="flex flex-wrap gap-2">${all.map(h => `<span class="px-3 py-1.5 bg-dark-700 rounded-full text-sm text-white border border-dark-500/30">${h.startsWith('#') ? h : `#${h}`}</span>`).join('')}</div>`,
    followers: 'Est. reach unknown (builds over time)',
  };
}

export function runPasswordGenerator(form: Record<string, string>): Record<string, string> {
  const length = Math.min(128, Math.max(8, parseInt(form.length || '16')));
  const useUpper = form.uppercase !== undefined;
  const useNum = form.numbers !== undefined;
  const useSym = form.symbols !== undefined;
  const excludeAmb = form.excludeAmbiguous !== undefined;
  const mode = form.mode || 'random';
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNum) charset += '0123456789';
  if (useSym) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (excludeAmb) charset = charset.replace(/[0O1lI]/g, '');
  if (charset.length === 0) charset = 'abcdefghijklmnopqrstuvwxyz';
  const getRandom = () => { const buf = new Uint32Array(1); crypto.getRandomValues(buf); return buf[0] / (0xFFFFFFFF + 1); };
  let password = '';
  if (mode === 'passphrase') {
    const words = ['apple', 'banana', 'castle', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor', 'island', 'jungle'];
    password = Array.from({ length: 4 }, () => words[Math.floor(getRandom() * words.length)]).join('-');
  } else if (mode === 'pronounceable') {
    const cons = 'bcdfghjklmnprstvwz';
    const vows = 'aeiou';
    let prev = '';
    for (let i = 0; i < length; i++) {
      const set = prev === 'c' ? vows : (Math.random() < 0.7 ? vows : cons);
      password += set[Math.floor(getRandom() * set.length)];
      prev = password[password.length - 1];
    }
  } else {
    password = Array.from({ length }, () => charset[Math.floor(getRandom() * charset.length)]).join('');
  }
  const strength = password.length >= 16 && useUpper && useNum && useSym ? 'Very Strong' :
                   password.length >= 12 ? 'Strong' :
                   password.length >= 8 ? 'Medium' : 'Weak';
  const crackTime = password.length >= 16 ? 'Centuries' :
                    password.length >= 12 ? 'Decades' :
                    password.length >= 8 ? 'Months' : 'Days';
  return { password, strength, crackTime };
}

export function runBmiCalculator(form: Record<string, string>): Record<string, string> {
  let heightM = parseFloat(form.heightValue || '0') / (form.heightUnit === 'in' ? 39.37 : 100);
  let weightKg = parseFloat(form.weightValue || '0') * (form.weightUnit === 'lbs' ? 0.453592 : 1);
  if (heightM <= 0 || weightKg <= 0) return { bmi: '--', category: 'Invalid input', healthyRange: '--' };
  const bmi = weightKg / (heightM * heightM);
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const minHealthy = (18.5 * heightM * heightM).toFixed(1);
  const maxHealthy = (24.9 * heightM * heightM).toFixed(1);
  return { bmi: bmi.toFixed(1), category, healthyRange: `${minHealthy}–${maxHealthy} kg` };
}

export function runTipCalculator(form: Record<string, string>): Record<string, string> {
  const bill = parseFloat(form.billAmount || '0');
  const tipPct = parseFloat(form.tipPercent || form.customTip || '18') / 100;
  const split = parseInt(form.split || form.customSplit || '1');
  const tip = bill * tipPct;
  const total = bill + tip;
  const perPerson = total / split;
  return {
    tipAmount: `$${tip.toFixed(2)}`,
    totalWithTip: `$${total.toFixed(2)}`,
    perPerson: `$${perPerson.toFixed(2)}`,
  };
}

export function runUnitConverter(form: Record<string, string>): Record<string, string> {
  const val = parseFloat(form.value || '1');
  const from = form.from || 'm';
  const to = form.to || 'km';
  const cat = form.category || 'length';
  if (cat === 'temp') {
    const conversions: Record<string, (v: number) => number> = {
      C_F: (v) => v * 9/5 + 32,
      C_K: (v) => v + 273.15,
      F_C: (v) => (v - 32) * 5/9,
      F_K: (v) => (v - 32) * 5/9 + 273.15,
      K_C: (v) => v - 273.15,
      K_F: (v) => (v - 273.15) * 9/5 + 32,
    };
    const key = `${from}_${to}`;
    const result = conversions[key] ? conversions[key](val) : val;
    return { result: `${result.toFixed(6)} ${to}`, allConversions: '' };
  }
  const toBase: Record<string, number> = {
    m: 1, km: 1000, mi: 1609.344, ft: 0.3048, inch: 0.0254, cm: 0.01, mm: 0.001, yd: 0.9144,
    kg: 1, lbs: 0.453592, oz: 0.0283495, g: 0.001, mg: 0.000001, ton: 1000,
    B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776,
  };
  const fromMult = toBase[from] ?? 1;
  const toMult = toBase[to] ?? 1;
  const result = (val * fromMult) / toMult;
  return { result: `${result.toFixed(6)} ${to}`, allConversions: '' };
}

export function runInvoiceGenerator(form: Record<string, string>): Record<string, string> {
  const from = form.fromName || 'Your Name';
  const to = form.toName || 'Client';
  const num = form.invoiceNumber || 'INV-001';
  const issue = form.issueDate || new Date().toISOString().slice(0, 10);
  const due = form.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  let items: { description: string; quantity: number; rate: number }[] = [];
  try { items = JSON.parse(form.items || '[]'); } catch { items = []; }
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const total = subtotal;
  const rows = items.map((i: { description: string; quantity: number; rate: number }) =>
    `<tr><td class="py-2 px-3 text-sm">${i.description}</td><td class="py-2 px-3 text-sm text-right">${i.quantity}</td><td class="py-2 px-3 text-sm text-right">$${i.rate.toFixed(2)}</td><td class="py-2 px-3 text-sm text-right">$${(i.quantity * i.rate).toFixed(2)}</td></tr>`
  ).join('');
  const preview = `<div class="bg-white text-gray-900 p-8 rounded-xl max-w-2xl mx-auto font-sans"><div class="flex justify-between mb-8"><div><h2 class="text-xl font-bold">${from}</h2><p class="text-sm text-gray-500">Invoice #${num}</p></div><div class="text-right text-sm text-gray-500"><p>Issued: ${issue}</p><p>Due: ${due}</p></div></div><div class="mb-6"><p class="text-sm text-gray-500">Bill To:</p><p class="font-semibold">${to}</p></div><table class="w-full mb-6 border-collapse"><thead><tr class="border-b border-gray-200"><th class="py-2 px-3 text-left text-sm text-gray-500">Description</th><th class="py-2 px-3 text-right text-sm text-gray-500">Qty</th><th class="py-2 px-3 text-right text-sm text-gray-500">Rate</th><th class="py-2 px-3 text-right text-sm text-gray-500">Amount</th></tr></thead><tbody>${rows}</tbody><tfoot class="border-t border-gray-200"><tr><td colspan="3" class="py-2 px-3 text-right font-semibold">Subtotal:</td><td class="py-2 px-3 text-right">$${subtotal.toFixed(2)}</td></tr><tr><td colspan="3" class="py-2 px-3 text-right font-semibold text-base">Total:</td><td class="py-2 px-3 text-right font-bold text-lg">$${total.toFixed(2)}</td></tr></tfoot></table><div class="text-center mt-6"><a href="https://paypal.me/ocultmaster9/${total.toFixed(0)}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-[#0070ba] text-white text-sm rounded-lg">Pay with PayPal.me</a></div></div>`;
  return { preview, downloadPDF: 'PDF download available in full version', paypalLink: `https://paypal.me/ocultmaster9/${total.toFixed(0)}` };
}

export function runRandomWordGenerator(form: Record<string, string>): Record<string, string> {
  const cat = form.category || 'mixed';
  const count = Math.min(100, Math.max(1, parseInt(form.count || '10')));
  const wordLists: Record<string, string[]> = {
    adjective: ['swift', 'luminous', 'robust', 'subtle', 'vivid', 'profound', 'arcane', 'sleek', 'radiant', 'mellow'],
    noun: ['horizon', 'lantern', 'canyon', 'cipher', 'orbit', 'nexus', 'sanctum', 'mosaic', 'prism', 'sentinel'],
    verb: ['drift', 'shatter', 'ignite', 'unfold', 'surge', 'cradle', 'spiral', 'fuse', 'bloom', 'ripple'],
    mixed: ['swift', 'horizon', 'drift', 'luminous', 'lantern', 'shatter', 'arcane', 'canyon', 'ignite', 'robust'],
    color: ['crimson', 'azure', 'amber', 'violet', 'emerald', 'scarlet', 'copper', 'indigo', 'gold', 'slate'],
    animal: ['falcon', 'lynx', 'otter', 'vulture', 'iguana', 'condor', 'puma', 'ocelot', 'wolverine', 'raven'],
    place: ['citadel', 'atlas', 'oasis', 'harbor', 'fjord', 'mesa', 'reef', 'tundra', 'archive', 'sanctum'],
    food: ['truffle', 'saffron', 'basil', 'pomegranate', 'prosciutto', 'mangosteen', 'cardamom', 'cashew', 'persimmon', 'aubergine'],
  };
  const words = wordLists[cat] || wordLists.mixed;
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  const html = `<div class="flex flex-wrap gap-2">${selected.map(w => `<span class="px-3 py-1.5 bg-dark-700 rounded-lg text-sm font-mono text-brand-300 border border-brand-500/20 cursor-pointer hover:bg-dark-600 transition-colors">${w}</span>`).join('')}</div>`;
  return { words: html };
}

export function runTool(slug: string, form: Record<string, string>): Record<string, string> {
  const algMap: Record<string, (f: Record<string, string>) => Record<string, string>> = {
    'tax-refund-calculator': runTaxRefund,
    'unscramble': runUnscramble,
    'word-counter': runWordCounter,
    'hashtag-generator': runHashtagGenerator,
    'password-generator': runPasswordGenerator,
    'bmi-calculator': runBmiCalculator,
    'tip-calculator': runTipCalculator,
    'unit-converter': runUnitConverter,
    'invoice-generator': runInvoiceGenerator,
    'random-word-generator': runRandomWordGenerator,
  };
  const runner = algMap[slug];
  if (!runner) return {};
  try { return runner(form); } catch { return {}; }
}
