#!/bin/sh

cd "$(dirname "$0")"

PASS=0
FAIL=0

OUT=".tmp"
rm -rf "$OUT"
mkdir -p "$OUT"

# Bundle the core+int-only consumer
bun build entry-core-int-only.ts --minify --outfile "$OUT/core-int.js" --external none 2>/dev/null
# Bundle the full consumer (as a control — these strings SHOULD appear here)
bun build entry-full.ts --minify --outfile "$OUT/full.js" --external none 2>/dev/null

CORE_BUNDLE="$OUT/core-int.js"
FULL_BUNDLE="$OUT/full.js"

if [ ! -f "$CORE_BUNDLE" ]; then
  echo "  FAIL  treeshake — core bundle failed to build"
  exit 1
fi

if [ ! -f "$FULL_BUNDLE" ]; then
  echo "  FAIL  treeshake — full bundle failed to build"
  exit 1
fi

# Strings that SHOULD be in the core+int bundle (proves int plugin is included)
EXPECTED_PRESENT="integer"

# Strings unique to plugins that should be shaken out when only int is used
SHOULD_BE_ABSENT="valid email address
Unknown UUID version
ISO 8601 date
RFC 3339 date
\$email
\$uuid
\$isodate
\$strictisodate"

# Verify int plugin IS present in core bundle
if grep -q "$EXPECTED_PRESENT" "$CORE_BUNDLE"; then
  echo "  PASS  treeshake — int plugin present in core bundle"
  PASS=$((PASS + 1))
else
  echo "  FAIL  treeshake — int plugin NOT found in core bundle"
  FAIL=$((FAIL + 1))
fi

# Verify unused plugins are absent from core bundle
echo "$SHOULD_BE_ABSENT" | while IFS= read -r marker; do
  if grep -q "$marker" "$CORE_BUNDLE"; then
    echo "  FAIL  treeshake — \"$marker\" found in core bundle (should be shaken out)"
    echo "TREESHAKE_FAIL" >> "$OUT/failures"
  fi
done

if [ -f "$OUT/failures" ]; then
  FAIL_COUNT=$(wc -l < "$OUT/failures" | tr -d ' ')
  FAIL=$((FAIL + FAIL_COUNT))
else
  echo "  PASS  treeshake — unused plugins absent from core bundle"
  PASS=$((PASS + 1))
fi

# Control: verify those strings DO exist in the full bundle (proves the test is valid)
CONTROL_MISSING=""
echo "$SHOULD_BE_ABSENT" | while IFS= read -r marker; do
  if ! grep -q "$marker" "$FULL_BUNDLE"; then
    echo "  FAIL  treeshake control — \"$marker\" NOT in full bundle (test is invalid)"
    echo "CONTROL_FAIL" >> "$OUT/control_failures"
  fi
done

if [ -f "$OUT/control_failures" ]; then
  FAIL_COUNT=$(wc -l < "$OUT/control_failures" | tr -d ' ')
  FAIL=$((FAIL + FAIL_COUNT))
else
  echo "  PASS  treeshake control — all markers present in full bundle"
  PASS=$((PASS + 1))
fi

# Size comparison (informational)
CORE_SIZE=$(wc -c < "$CORE_BUNDLE" | tr -d ' ')
FULL_SIZE=$(wc -c < "$FULL_BUNDLE" | tr -d ' ')
echo "  INFO  core+int bundle: ${CORE_SIZE}B  full bundle: ${FULL_SIZE}B"

rm -rf "$OUT"

echo "TREESHAKE_PASS=$PASS"
echo "TREESHAKE_FAIL=$FAIL"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
