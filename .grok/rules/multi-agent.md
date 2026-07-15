# Multi-agent (project rule)

1. Prefer `.grok/agents/site-*` when parallelizing.
2. **Solo by default.** Parallel only if ≥2 independent workstreams (non-overlapping files, one-line done-when each). Cap 3 implementers.
3. Spawn prompt: ownership + must-not + stop condition.
4. Handoff format from `MULTI_AGENT.md`.
5. No two agents writing the same file in parallel.
6. Shared systems (shell, gestures, binder) stay **serial**.
7. Research web before architecture/options.
8. Honesty: break risk, works-but-wrong, untested — no false green.
9. No fragile patches without explicit human OK.
10. Update `PROGRESS.md` workstreams when spawning/merging.
