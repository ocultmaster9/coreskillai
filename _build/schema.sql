-- Schema for the item-response database (Cloudflare D1).
--
-- Two tables, because item DIFFICULTY needs only counts but item DISCRIMINATION
-- needs each response linked to that person's total score. Discrimination is the
-- statistic that tells us which items actually separate strong reasoners from
-- weak ones, and it is the reason rows are grouped per session rather than
-- accumulated as bare counters.
--
-- There is deliberately no column for IP, user agent, cookie, device id or clock
-- time. `day` is date-only. Nothing here identifies a person.
--
-- Create and bind:
--   wrangler d1 create coreskillai-responses
--   wrangler d1 execute coreskillai-responses --remote --file=_build/schema.sql
-- then bind it to the Pages project as RESPONSES.

CREATE TABLE IF NOT EXISTS sessions (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  day   TEXT    NOT NULL,          -- YYYY-MM-DD, no time of day
  test  TEXT    NOT NULL,          -- 'iq' | 'pattern'
  lang  TEXT    NOT NULL,          -- market, for cross-cultural DIF
  n     INTEGER NOT NULL,          -- items presented
  raw   INTEGER NOT NULL,          -- items correct
  secs  INTEGER NOT NULL DEFAULT 0 -- total seconds taken
);

CREATE TABLE IF NOT EXISTS responses (
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  pos        INTEGER NOT NULL,     -- 1..n, position in that person's test
  sig        TEXT    NOT NULL,     -- rule signature, e.g. shape:dist3|count:progression|...
  difficulty INTEGER NOT NULL,     -- our THEORETICAL difficulty, to be checked against reality
  correct    INTEGER NOT NULL,     -- 0 | 1
  ms         INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_resp_session ON responses(session_id);
CREATE INDEX IF NOT EXISTS idx_resp_sig     ON responses(sig);
CREATE INDEX IF NOT EXISTS idx_sess_test    ON sessions(test, day);

-- The first question worth asking once data exists: does our theoretical
-- difficulty actually predict how often people get an item right? If this
-- correlation is weak, the difficulty ordering shown to every visitor is wrong.
--
--   SELECT r.sig,
--          r.difficulty                AS theoretical,
--          ROUND(AVG(r.correct), 3)    AS p_value,
--          COUNT(*)                    AS n
--     FROM responses r
--    GROUP BY r.sig
--   HAVING n >= 50
--    ORDER BY p_value DESC;
