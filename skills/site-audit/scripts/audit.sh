#!/bin/bash
# Site Audit — The Wartime Report
# Validates all pages, links, stats, timestamps, and cross-references
# Exit code 0 = pass, 1 = failures found
# Output: human-readable report with ✅/❌ markers

REPO="${1:-$HOME/wartime-report}"
ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; WARNINGS=$((WARNINGS + 1)); }

echo "========================================"
echo "  WARTIME REPORT — FULL SITE AUDIT"
echo "========================================"
echo ""

# --- 1. REPORT FILES ---
echo "=== 1. REPORT FILES ==="
REPORT_COUNT=$(ls "$REPO/reports/day-"*.html 2>/dev/null | wc -l)
LATEST_DAY=$(ls "$REPO/reports/day-"*.html | sed 's/.*day-//;s/\.html//' | sort -n | tail -1)
echo "Reports: $REPORT_COUNT files, latest: Day $LATEST_DAY"

# Check sequential (no gaps)
for i in $(seq 1 "$LATEST_DAY"); do
  if [ ! -f "$REPO/reports/day-${i}.html" ]; then
    fail "Missing report: day-${i}.html"
  fi
done
if [ "$ERRORS" -eq 0 ]; then pass "All $REPORT_COUNT reports present (Day 1-$LATEST_DAY)"; fi

# --- 2. NAV LINKS (prev/next) ---
echo ""
echo "=== 2. NAV LINKS ==="
NAV_ERRORS=0
for i in $(seq 1 "$LATEST_DAY"); do
  file="$REPO/reports/day-${i}.html"
  if [ "$i" -gt 1 ]; then
    prev_expected="day-$((i-1)).html"
    if ! grep -q "href=\"${prev_expected}\"" "$file" 2>/dev/null; then
      fail "Day $i: missing prev link to Day $((i-1))"
      NAV_ERRORS=$((NAV_ERRORS + 1))
    fi
  fi
  if [ "$i" -lt "$LATEST_DAY" ]; then
    next_expected="day-$((i+1)).html"
    if ! grep -q "href=\"${next_expected}\"" "$file" 2>/dev/null; then
      fail "Day $i: missing next link to Day $((i+1))"
      NAV_ERRORS=$((NAV_ERRORS + 1))
    fi
  fi
done
if [ "$NAV_ERRORS" -eq 0 ]; then pass "All prev/next nav links correct"; fi

# --- 3. LIVE BADGES ---
echo ""
echo "=== 3. LIVE BADGES ==="
LIVE_REPORTS=$(grep -rl "LIVE" "$REPO/reports/" --include="*.html" 2>/dev/null | while read f; do basename "$f" .html | sed 's/day-//'; done | sort -n)
LIVE_COUNT=$(echo "$LIVE_REPORTS" | grep -c '[0-9]')
if [ "$LIVE_COUNT" -eq 1 ] && [ "$(echo "$LIVE_REPORTS" | tr -d ' ')" = "$LATEST_DAY" ]; then
  pass "LIVE badge only on Day $LATEST_DAY"
elif [ "$LIVE_COUNT" -eq 0 ]; then
  fail "No report has a LIVE badge (Day $LATEST_DAY should)"
else
  for d in $LIVE_REPORTS; do
    if [ "$d" != "$LATEST_DAY" ]; then
      fail "Day $d still has LIVE badge (should only be on Day $LATEST_DAY)"
    fi
  done
fi

# --- 4. HOMEPAGE ---
echo ""
echo "=== 4. HOMEPAGE ==="
HP="$REPO/index.html"

# Hero day number
HERO_DAY=$(grep -oP 'Operation Epic Fury — Day \K\d+' "$HP")
if [ "$HERO_DAY" = "$LATEST_DAY" ]; then
  pass "Hero: Day $HERO_DAY"
else
  fail "Hero says Day $HERO_DAY, should be Day $LATEST_DAY"
fi

# Hero button link
if grep -q "href=\"reports/day-${LATEST_DAY}.html\".*Read Today" "$HP"; then
  pass "Hero button links to Day $LATEST_DAY"
else
  fail "Hero button doesn't link to day-${LATEST_DAY}.html"
fi

# Latest report card
FIRST_CARD=$(grep -oP 'href="reports/day-\K\d+' "$HP" | head -1)
if [ "$FIRST_CARD" = "$LATEST_DAY" ]; then
  pass "First report card is Day $LATEST_DAY"
else
  fail "First report card is Day $FIRST_CARD, should be Day $LATEST_DAY"
fi

# LIVE badge on homepage
HP_LIVE_DAY=$(grep -B5 "badge-live-small.*LIVE" "$HP" | grep -oP 'DAY \K\d+' | head -1)
if [ "$HP_LIVE_DAY" = "$LATEST_DAY" ]; then
  pass "Homepage LIVE badge on Day $LATEST_DAY"
else
  fail "Homepage LIVE badge on Day $HP_LIVE_DAY, should be Day $LATEST_DAY"
fi

# --- 5. TIMELINE ---
echo ""
echo "=== 5. TIMELINE ==="
TL="$REPO/pages/timeline.html"

TL_DAYS=$(grep -oP 'DAY \K\d+' "$TL" | sort -n)
TL_MAX=$(echo "$TL_DAYS" | tail -1)
TL_COUNT=$(echo "$TL_DAYS" | wc -l)

if [ "$TL_MAX" = "$LATEST_DAY" ]; then
  pass "Timeline includes Day $LATEST_DAY"
else
  fail "Timeline latest is Day $TL_MAX, should be Day $LATEST_DAY"
fi

if [ "$TL_COUNT" -eq "$LATEST_DAY" ]; then
  pass "Timeline has all $TL_COUNT days"
else
  warn "Timeline has $TL_COUNT entries, expected $LATEST_DAY"
fi

# LIVE badge only on latest
TL_LIVE=$(grep -B2 "LIVE" "$TL" | grep -oP 'DAY \K\d+' | head -1)
if [ "$TL_LIVE" = "$LATEST_DAY" ]; then
  pass "Timeline LIVE badge on Day $LATEST_DAY"
else
  fail "Timeline LIVE badge on Day $TL_LIVE, should be Day $LATEST_DAY"
fi

# --- 6. KEY FACTS ---
echo ""
echo "=== 6. KEY FACTS ==="
FACTS_DAY=$(grep -oP 'as of Day \K\d+' "$HP" | head -1)
if [ "$FACTS_DAY" = "$LATEST_DAY" ]; then
  pass "Key facts reference Day $LATEST_DAY"
else
  fail "Key facts reference Day $FACTS_DAY, should be Day $LATEST_DAY"
fi

OIL_DAY=$(grep -oP 'Brent Crude \(Day \K\d+' "$HP" | head -1)
if [ "$OIL_DAY" = "$LATEST_DAY" ]; then
  pass "Oil price stat references Day $LATEST_DAY"
else
  fail "Oil price stat references Day $OIL_DAY, should be Day $LATEST_DAY"
fi

# --- 7. ABOUT PAGE ---
echo ""
echo "=== 7. ABOUT PAGE ==="
ABOUT_COUNT=$(grep -oP 'font-weight: 700; color: var\(--accent-red\);">\K\d+' "$REPO/pages/about.html" | head -1)
if [ "$ABOUT_COUNT" -ge "$LATEST_DAY" ]; then
  pass "About page: $ABOUT_COUNT+ reports (actual: $REPORT_COUNT)"
else
  fail "About page says $ABOUT_COUNT+ reports, should be $REPORT_COUNT+"
fi

# --- 8. ECONOMICS HUB ---
echo ""
echo "=== 8. ECONOMICS HUB ==="
ECON_DAY=$(grep -oP 'Day \K\d+' "$REPO/economics/index.html" | tail -1)
if [ "$ECON_DAY" = "$LATEST_DAY" ]; then
  pass "Economics hub references Day $LATEST_DAY"
else
  fail "Economics hub references Day $ECON_DAY, should be Day $LATEST_DAY"
fi

# --- 9. SITEMAP ---
echo ""
echo "=== 9. SITEMAP ==="
SM_REPORTS=$(grep -c "day-" "$REPO/sitemap.xml" 2>/dev/null)
SM_MISSING=0
for i in $(seq 1 "$LATEST_DAY"); do
  if ! grep -q "day-${i}.html" "$REPO/sitemap.xml" 2>/dev/null; then
    fail "Sitemap missing day-${i}.html"
    SM_MISSING=$((SM_MISSING + 1))
  fi
done
if [ "$SM_MISSING" -eq 0 ]; then pass "Sitemap has all $SM_REPORTS report URLs"; fi

# Check non-report pages in sitemap
for page in index.html pages/about.html pages/timeline.html pages/start-here.html economics/index.html economics/impact.html economics/investments.html economics/research.html investigations/index.html; do
  if ! grep -q "$page" "$REPO/sitemap.xml" 2>/dev/null; then
    fail "Sitemap missing $page"
  fi
done

# --- 10. RSS FEED ---
echo ""
echo "=== 10. RSS FEED ==="
if grep -q "day-${LATEST_DAY}.html" "$REPO/feed.xml" 2>/dev/null; then
  pass "RSS feed includes Day $LATEST_DAY"
else
  fail "RSS feed missing Day $LATEST_DAY"
fi

# --- 11. SEARCH INDEX ---
echo ""
echo "=== 11. SEARCH INDEX ==="
SI_FILE="$REPO/assets/js/search-index.js"
if [ -f "$SI_FILE" ]; then
  SI_ENTRIES=$(grep -c "title" "$SI_FILE")
  if grep -q "day-${LATEST_DAY}" "$SI_FILE" 2>/dev/null; then
    pass "Search index has Day $LATEST_DAY ($SI_ENTRIES total entries)"
  else
    fail "Search index missing Day $LATEST_DAY"
  fi
else
  fail "Search index file missing"
fi

# --- 12. IMAGE DEDUP ---
echo ""
echo "=== 12. IMAGE DEDUP ==="
DUPES=$(for f in "$REPO/reports/day-"*.html; do
  day=$(basename "$f" .html | sed 's/day-//')
  src=$(grep -oP 'img loading="lazy" src="\K[^"]+' "$f" | head -1)
  [ -n "$src" ] && echo "$day: $src"
done | sort -t: -k2 | uniq -d -f1)

if [ -z "$DUPES" ]; then
  pass "No duplicate hero images"
else
  fail "Duplicate images found: $DUPES"
fi

# --- 13. BROKEN LINKS ---
echo ""
echo "=== 13. INTERNAL LINKS ==="
BROKEN=0
for i in $(seq 1 "$LATEST_DAY"); do
  links=$(grep -oP 'href="day-\d+\.html"' "$REPO/reports/day-${i}.html" | grep -oP 'day-\d+' | sort -u)
  for link in $links; do
    if [ ! -f "$REPO/reports/${link}.html" ]; then
      fail "Day $i links to ${link}.html (doesn't exist)"
      BROKEN=$((BROKEN + 1))
    fi
  done
done
if [ "$BROKEN" -eq 0 ]; then pass "No broken internal links"; fi

# --- 14. CANONICAL URLS ---
echo ""
echo "=== 14. CANONICAL URLS ==="
CANONICAL_ERRORS=0
for i in $(seq 1 "$LATEST_DAY"); do
  expected="https://thewartimereport.com/reports/day-${i}.html"
  actual=$(grep -oP 'canonical.*href="\K[^"]+' "$REPO/reports/day-${i}.html" 2>/dev/null)
  if [ "$actual" != "$expected" ]; then
    fail "Day $i canonical: $actual (expected $expected)"
    CANONICAL_ERRORS=$((CANONICAL_ERRORS + 1))
  fi
done
if [ "$CANONICAL_ERRORS" -eq 0 ]; then pass "All canonical URLs correct"; fi

# --- 15. OG TAGS ---
echo ""
echo "=== 15. OG/META TAGS ==="
OG_ERRORS=0
for i in $(seq 1 "$LATEST_DAY"); do
  file="$REPO/reports/day-${i}.html"
  for tag in "og:title" "og:description" "og:image" "og:url" "twitter:title" "twitter:image"; do
    if ! grep -q "$tag" "$file" 2>/dev/null; then
      fail "Day $i missing $tag"
      OG_ERRORS=$((OG_ERRORS + 1))
    fi
  done
done
if [ "$OG_ERRORS" -eq 0 ]; then pass "All OG/Twitter meta tags present"; fi

# --- 16. TIMESTAMPS ---
echo ""
echo "=== 16. TIMESTAMPS ==="
echo "Page timestamps (check for staleness):"
for f in "$REPO/index.html" "$REPO/pages/about.html" "$REPO/pages/timeline.html" "$REPO/economics/index.html" "$REPO/economics/impact.html"; do
  ts=$(grep -oP 'Last updated.*?<time datetime="\K[^"]+' "$f" 2>/dev/null | head -1)
  name=$(echo "$f" | sed "s|$REPO/||")
  if [ -n "$ts" ]; then
    echo "  $name: $ts"
  else
    warn "$name: no timestamp found"
  fi
done

# --- SUMMARY ---
echo ""
echo "========================================"
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}AUDIT PASSED${NC} — 0 errors, $WARNINGS warnings"
  exit 0
else
  echo -e "${RED}AUDIT FAILED${NC} — $ERRORS errors, $WARNINGS warnings"
  exit 1
fi
