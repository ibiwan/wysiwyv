---
name: No direct edits to authored code
description: User wants changes described rather than applied directly, except in bench/ or throwaway dirs
type: feedback
---

Never edit project source files directly; describe changes so the user can type them. Exception: `bench/` and similar throwaway/test-harness directories can be edited freely.

**Why:** The published code is under the user's authorship — they want to type it themselves.
**How to apply:** For anything in `src/`, `tests/`, root config files, READMEs, etc., describe the change. For `bench/` (benchmarking harness), edit directly.
