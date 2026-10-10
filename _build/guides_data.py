# -*- coding: utf-8 -*-
"""Metadata for the English-only editorial pages (blog, reference pages,
methodology). Body text lives in content/guides/<slug>.html.

Kept apart from guides.py so refresh.py can import the URL list for the
sitemap without importing the renderer."""

SITE = 'https://coreskillai.com'
AUTHOR = 'Eduard-Dragos Condria'
PUBLISHED = '2026-10-10'
PUBLISHED_HUMAN = 'October 10, 2026'

TEST_NAMES = {
    'iq': 'IQ Test', 'reaction-time': 'Reaction Time Test', 'memory': 'Working Memory Test',
    'pattern': 'Pattern Recognition Test', 'color-vision': 'Color Vision Test',
    'big-five': 'Big Five Personality Test', 'eq': 'Emotional Intelligence Test',
    'focus': 'Focus & Attention Test', 'typing': 'Typing Speed Test', 'rotation': 'Mental Rotation Test',
}

# kind: blog -> /blog/<slug>/ ; ref -> /<slug>/ ; page -> /<slug>/
PAGES = [
 # ---- blog ----
 dict(slug='what-is-a-good-iq-score', kind='blog', min=8, tests=['iq'], ref=['iq-score-chart'],
      title='What Is a Good IQ Score? Ranges, Percentiles and What They Mean',
      desc='What counts as a good IQ score, how IQ ranges map to percentiles, and why a single number says less than most people think.'),
 dict(slug='are-online-iq-tests-accurate', kind='blog', min=8, tests=['iq'], ref=['methodology'],
      title='Are Online IQ Tests Accurate? What Reliability and Norming Actually Mean',
      desc='Why most online IQ tests cannot give a trustworthy score, what a proper test needs, and how to judge any test you find online.'),
 dict(slug='fluid-vs-crystallized-intelligence', kind='blog', min=7, tests=['pattern', 'iq'], ref=[],
      title='Fluid vs Crystallized Intelligence: The Difference and Why It Matters',
      desc='Fluid reasoning and crystallized knowledge are two different parts of intelligence. How Cattell and Horn described them and how each changes with age.'),
 dict(slug='flynn-effect-explained', kind='blog', min=7, tests=['iq'], ref=[],
      title='The Flynn Effect Explained: Why IQ Scores Rose for a Century',
      desc='Raw IQ scores rose about three points per decade through most of the 20th century. What caused it, and why the trend has reversed in some countries.'),
 dict(slug='how-to-improve-working-memory', kind='blog', min=8, tests=['memory'], ref=['digit-span-norms'],
      title='How to Improve Working Memory: What the Evidence Supports',
      desc='Practical, evidence-based ways to get more out of working memory: chunking, sleep, exercise and strategy, and what does not work.'),
 dict(slug='does-brain-training-work', kind='blog', min=8, tests=['memory', 'iq'], ref=[],
      title='Does Brain Training Work? A Look at the Research',
      desc='Brain-training games improve the games. Whether that carries over to everyday thinking is a different question, and the research is not encouraging.'),
 dict(slug='how-to-improve-reaction-time', kind='blog', min=7, tests=['reaction-time'], ref=['reaction-time-by-age'],
      title='How to Improve Your Reaction Time (and How to Measure It Fairly)',
      desc='What limits human reaction time, what practice can and cannot change, and why your screen and mouse matter more than you expect.'),
 dict(slug='big-five-personality-traits-explained', kind='blog', min=9, tests=['big-five'], ref=['big-five-score-meaning'],
      title='The Big Five Personality Traits Explained',
      desc='Openness, conscientiousness, extraversion, agreeableness and neuroticism: what each trait measures, how stable they are, and how they differ from MBTI.'),
 dict(slug='eq-vs-iq', kind='blog', min=8, tests=['eq', 'iq'], ref=['emotional-intelligence-score-meaning'],
      title='EQ vs IQ: What Each Predicts and What the Popular Claims Get Wrong',
      desc='Emotional intelligence and IQ measure different things. What the research says about each, and why the "EQ matters more" slogan is overstated.'),
 dict(slug='colour-blindness-types-and-tests', kind='blog', min=8, tests=['color-vision'], ref=[],
      title='Colour Blindness: Types, Causes and How Testing Works',
      desc='Protan, deutan and tritan deficiencies explained, how common each is, why it affects men more often, and what online screening can and cannot tell you.'),
 dict(slug='how-to-type-faster', kind='blog', min=8, tests=['typing'], ref=['average-typing-speed'],
      title='How to Type Faster: Accuracy First, Then Speed',
      desc='A practical method for raising typing speed: technique, deliberate practice and error handling, based on what large typing studies show.'),
 dict(slug='stroop-effect-explained', kind='blog', min=7, tests=['focus'], ref=[],
      title='The Stroop Effect Explained: Why Reading Gets in the Way of Seeing',
      desc='The Stroop effect shows how automatic reading interferes with naming colours. What it reveals about attention and cognitive control.'),
 dict(slug='sleep-and-cognitive-performance', kind='blog', min=8, tests=['focus', 'reaction-time'], ref=[],
      title='Sleep and Cognitive Performance: What Short Nights Do to Your Brain',
      desc='How sleep loss slows reaction time, narrows attention and distorts self-assessment, and what that means before you take any cognitive test.'),
 dict(slug='mental-rotation-ability', kind='blog', min=7, tests=['rotation'], ref=[],
      title='Mental Rotation: How We Turn Objects in the Mind',
      desc='Shepard and Metzler showed that people rotate mental images at a measurable speed. What mental rotation measures and how spatial skill can be trained.'),
 # ---- reference pages ----
 dict(slug='iq-score-chart', kind='ref', min=6, tests=['iq'], ref=[],
      title='IQ Score Chart: Ranges, Percentiles and Classifications',
      desc='A full IQ score chart from 55 to 160 with percentiles, plus a converter between IQ and percentile.'),
 dict(slug='reaction-time-by-age', kind='ref', min=6, tests=['reaction-time'], ref=[],
      title='Average Reaction Time by Age: What the Research Shows',
      desc='How simple and choice reaction time change from the twenties to old age, with figures from published studies and what affects your own result.'),
 dict(slug='average-typing-speed', kind='ref', min=6, tests=['typing'], ref=[],
      title='Average Typing Speed: WPM Benchmarks and a Calculator',
      desc='What counts as slow, average and fast typing, with figures from a 168,000-person study and a words-per-minute calculator.'),
 dict(slug='iq-test-for-kids', kind='ref', min=6, tests=['iq'], ref=[],
      title='IQ Tests for Kids: What Parents Should Know',
      desc='How children are properly assessed, why an online adult-style test is not suitable for a child, and what to do if you have concerns.'),
 dict(slug='digit-span-norms', kind='ref', min=6, tests=['memory'], ref=[],
      title='Digit Span Norms: What Is a Normal Memory Span?',
      desc='Typical forward and backward digit span for adults, how the task works, and what a short or long span does and does not mean.'),
 dict(slug='big-five-score-meaning', kind='ref', min=6, tests=['big-five'], ref=[],
      title='Big Five Scores: How to Read Low, Average and High',
      desc='How to interpret low, average and high scores on each Big Five trait, and why no score on any trait is "bad".'),
 dict(slug='emotional-intelligence-score-meaning', kind='ref', min=6, tests=['eq'], ref=[],
      title='Emotional Intelligence Scores: What Your EQ Result Means',
      desc='What a self-report EQ score measures, how it differs from ability-based tests, and how to use your result sensibly.'),
 # ---- standalone ----
 dict(slug='methodology', kind='page', min=7, tests=[], ref=[],
      title='Methodology: How CoreSkillAI Tests Are Built and Scored',
      desc='How each CoreSkillAI test is designed, how scores and percentiles are calculated, what the limits are, and how we handle corrections.'),
]

def path_of(p):
    return 'blog/%s/' % p['slug'] if p['kind'] == 'blog' else '%s/' % p['slug']

def url_of(p):
    return '%s/%s' % (SITE, path_of(p))

def extra_urls():
    """[(url, priority)] for the sitemap: English-only pages."""
    out = [(SITE + '/blog/', '0.8')]
    for p in PAGES:
        out.append((url_of(p), '0.7' if p['kind'] == 'blog' else '0.6'))
    return out
