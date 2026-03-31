---
name: site-audit
description: Full site audit for The Wartime Report. Run before every deploy to validate all pages, links, stats, timestamps, nav, badges, sitemap, RSS, search index, and cross-references are correct and current. Use when any page is created, updated, or when transitioning between days. Must pass before pushing to main.
---

# Site Audit

Run `bash ~/wartime-report/skills/site-audit/scripts/audit.sh` before every deploy.

## When to Run

- After creating a new day's report (day transition)
- After updating any page content
- After heartbeat updates to the current day's report
- Before any `auto-deploy.sh` call

## What It Checks

1. **Report files** — all sequential, no gaps
2. **Nav links** — every report has correct prev/next
3. **LIVE badges** — only on the latest day's report, homepage card, and timeline entry
4. **Homepage** — hero day number, button link, first card, LIVE badge all point to latest day
5. **Timeline** — includes all days, LIVE only on latest
6. **Key facts** — casualty/oil/deadline stats reference the latest day
7. **About page** — report count matches actual
8. **Economics hub** — day reference and oil price current
9. **Sitemap** — all reports + all static pages present
10. **RSS feed** — latest day included
11. **Search index** — latest day indexed
12. **Image dedup** — no two reports share the same hero image
13. **Internal links** — no broken report-to-report links
14. **Canonical URLs** — all correct
15. **OG/Twitter meta tags** — all present on every report
16. **Timestamps** — printed for staleness review

## Fixing Failures

If the audit fails, fix each ❌ item. Common fixes:
- Missing homepage/timeline entry → add the new day's card/entry
- Stale LIVE badge → remove from old day, add to new
- Wrong hero day → update `index.html` hero h2 and button
- Stale key facts → update oil price, casualty numbers, deadline countdown
- Missing sitemap/RSS → run `bash ~/wartime-report/scripts/update-feeds.sh`
- Missing search index → run `bash ~/wartime-report/scripts/update-search.sh`

After fixing, re-run the audit until it passes, then deploy.

## Integration with auto-deploy

The deploy workflow should be:
1. Make changes on staging branch
2. Run `bash ~/wartime-report/skills/site-audit/scripts/audit.sh`
3. Fix any failures
4. Commit to staging
5. Run `bash ~/wartime-report/scripts/auto-deploy.sh 'commit message'`
