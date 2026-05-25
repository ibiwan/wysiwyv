#!/bin/sh

cd "$(dirname "$0")"

PASS=0
FAIL=0

run() {
  label="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "  PASS  $label"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $label"
    FAIL=$((FAIL + 1))
  fi
}

section() {
  echo ""
  echo "=== $1 ==="
}

# --- npm-full tests ---

section "Setup"
cd npm-full
echo "  npm install..."
npm i --silent 2>/dev/null

section "Node ESM"
run "node esm — core only"          node index-core.mjs
run "node esm — full"               node index-full.mjs
run "node esm — core + plugins"     node index-core+int.mjs

section "Bun TS"
run "bun ts — core only"            bun index-core.ts
run "bun ts — full"                 bun index-full.ts
run "bun ts — core + plugins"       bun index-core+int.ts

section "TypeScript type-checking"
run "tsc — moduleResolution node16"   npx tsc --noEmit -p tsconfig.node16.json
run "tsc — moduleResolution bundler"  npx tsc --noEmit -p tsconfig.bundler.json

section "CJS require (negative)"
CJS_OUTPUT=$(node cjs-require.cjs 2>&1)
echo "$CJS_OUTPUT" | grep -E "^(PASS|FAIL)" | while read -r line; do
  echo "  $line"
done
CJS_PASS=$(echo "$CJS_OUTPUT" | grep "^CJS_PASS=" | cut -d= -f2)
CJS_FAIL=$(echo "$CJS_OUTPUT" | grep "^CJS_FAIL=" | cut -d= -f2)
PASS=$((PASS + ${CJS_PASS:-0}))
FAIL=$((FAIL + ${CJS_FAIL:-0}))

cd ..

# --- CDN tests ---

section "CDN bundles"
CDN_OUTPUT=$(node cdn/test-cdn.mjs 2>&1)
echo "$CDN_OUTPUT" | grep -E "^(PASS|FAIL)" | while read -r line; do
  echo "  $line"
done
CDN_PASS=$(echo "$CDN_OUTPUT" | grep "^CDN_PASS=" | cut -d= -f2)
CDN_FAIL=$(echo "$CDN_OUTPUT" | grep "^CDN_FAIL=" | cut -d= -f2)
PASS=$((PASS + ${CDN_PASS:-0}))
FAIL=$((FAIL + ${CDN_FAIL:-0}))

# --- Tree-shaking tests ---

section "Tree-shaking"
cd treeshake
npm i --silent 2>/dev/null
TS_OUTPUT=$(sh test-treeshake.sh 2>&1)
echo "$TS_OUTPUT" | grep -E "^  (PASS|FAIL|INFO)" | while read -r line; do
  echo "$line"
done
TS_PASS=$(echo "$TS_OUTPUT" | grep "^TREESHAKE_PASS=" | cut -d= -f2)
TS_FAIL=$(echo "$TS_OUTPUT" | grep "^TREESHAKE_FAIL=" | cut -d= -f2)
PASS=$((PASS + ${TS_PASS:-0}))
FAIL=$((FAIL + ${TS_FAIL:-0}))
cd ..

# --- Browser tests ---

section "Browser (headless Chromium)"
cd browser
npm i --silent 2>/dev/null
BR_OUTPUT=$(node test-browser.mjs 2>&1)
echo "$BR_OUTPUT" | grep -E "^(PASS|FAIL)" | while read -r line; do
  echo "  $line"
done
BR_PASS=$(echo "$BR_OUTPUT" | grep "^BROWSER_PASS=" | cut -d= -f2)
BR_FAIL=$(echo "$BR_OUTPUT" | grep "^BROWSER_FAIL=" | cut -d= -f2)
PASS=$((PASS + ${BR_PASS:-0}))
FAIL=$((FAIL + ${BR_FAIL:-0}))
cd ..

# --- Summary ---

echo ""
echo "=== Results ==="
TOTAL=$((PASS + FAIL))
echo "  $PASS/$TOTAL passed"

if [ "$FAIL" -gt 0 ]; then
  echo "  $FAIL FAILED"
  exit 1
else
  echo "  All passed"
fi
