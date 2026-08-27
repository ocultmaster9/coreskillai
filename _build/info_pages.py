# -*- coding: utf-8 -*-
"""Build the four info pages (about/privacy/terms/contact) for one market.

Takes a flat dict of strings and renders the markup, so each language only supplies
prose and the structure stays identical across all markets.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tools import set_info, add_meta

P = 'style="font-size:.95rem;color:var(--text-2);line-height:1.8"'
H1 = 'style="font-size:2rem;font-weight:800;margin-bottom:24px"'
EMAIL = 'ocultmaster9@gmail.com'


def privacy_html(D):
    return (
        '    <h1 %s>%s</h1>\n'
        '    <div class="instruction-card">\n'
        '      <p %s><strong>%s</strong> %s<br><br>\n'
        '      <strong>%s</strong> %s<br><br>\n'
        '      <strong>%s</strong> %s <a href="https://policies.google.com/privacy" '
        'target="_blank" rel="noopener">%s</a>.<br><br>\n'
        '      <strong>%s</strong> %s<br><br>\n'
        '      <strong>%s</strong> <a href="mailto:%s">%s</a></p>\n'
        '    </div>'
    ) % (H1, D['h1'], P, D['data_l'], D['data'], D['cookies_l'], D['cookies'],
         D['ads_l'], D['ads'], D['ads_link'], D['analytics_l'], D['analytics'],
         D['contact_l'], EMAIL, EMAIL)


def contact_html(D):
    return (
        '    <h1 %s>%s</h1>\n'
        '    <div class="instruction-card">\n'
        '      <p %s>%s</p>\n'
        '      <p %s><strong>%s</strong> <a href="mailto:%s">%s</a></p>\n'
        '      <p %s><strong>%s</strong> %s</p>\n'
        '      <p %s><strong>%s</strong> %s</p>\n'
        '    </div>'
    ) % (H1, D['h1'], P, D['intro'], P, D['email_l'], EMAIL, EMAIL,
         P, D['good_l'], D['good'], P, D['note_l'], D['note'])


TERMS_KEYS = ['accept', 'what', 'clinical', 'guarantee', 'use', 'ip',
              'ads', 'liability', 'changes']


def terms_html(D):
    rows = ''.join(
        '      <p %s><strong>%s</strong> %s</p>\n' % (P, D[k + '_l'], D[k])
        for k in TERMS_KEYS)
    return (
        '    <h1 %s>%s</h1>\n'
        '    <div class="instruction-card">\n%s'
        '      <p %s><strong>%s</strong> <a href="mailto:%s">%s</a></p>\n'
        '    </div>'
    ) % (H1, D['h1'], rows, P, D['contact_l'], EMAIL, EMAIL)


CARDS = [('\U0001F4CA', 'c1'), ('\U0001F9EA', 'c2'),
         ('\U0001F512', 'c3'), ('\U0001F310', 'c4')]
SCI = ['s1', 's2', 's3', 's4', 's5']


def about_html(D):
    cards = ''.join(
        '      <div class="science-card"><span style="font-size:1.8rem">%s</span>'
        '<h3>%s</h3><p>%s</p></div>\n' % (emo, D[k + '_h'], D[k + '_p'])
        for emo, k in CARDS)
    sci = ''.join(
        '      <div class="instruction-card" style="margin-bottom:14px">'
        '<h3 style="margin-bottom:6px">%s</h3><p %s>%s</p></div>\n'
        % (D[k + '_h'], P, D[k + '_p']) for k in SCI)
    return (
        '    <h1 %s>%s</h1>\n'
        '    <p %s>%s</p>\n'
        '    <h2 class="section-title" style="margin-top:32px">%s</h2>\n'
        '    <p %s>%s</p>\n'
        '    <p %s>%s</p>\n'
        '    <div class="science-grid" style="margin-top:24px">\n%s    </div>\n'
        '    <h2 class="section-title" style="margin-top:36px">%s</h2>\n%s'
        '    <h2 class="section-title" style="margin-top:36px">%s</h2>\n'
        '    <p %s>%s</p>\n'
        '    <p %s>%s</p>'
    ) % (H1, D['h1'], P, D['sub'], D['mission_h'], P, D['mission_p1'],
         P, D['mission_p2'], cards, D['science_h'], sci,
         D['approach_h'], P, D['approach_p1'], P, D['approach_p2'])


BUILD = {'privacy': privacy_html, 'contact': contact_html,
         'terms': terms_html, 'about': about_html}


def apply_market(lang, data):
    """data: {page: {...strings..., '_title':..., '_desc':...}}"""
    n = 0
    for page, D in data.items():
        if set_info(lang, page, BUILD[page](D)):
            n += 1
        add_meta(lang, {page: {'title': D['_title'], 'desc': D['_desc']}})
    return n
