# Runs

One folder per run: `runs/<agent>-<variant>-<YYYY-MM-DD>/` with `<prompt-id>.tsx` (and optional `<prompt-id>.css`) per prompt, `run.json` (agent, variant, model, CLI version, date), the raw replies (`<prompt-id>.reply.md`), and `scorecard.json` + `scorecard.md` written by `npm run score -- runs/<folder>`.

Commit a run folder when its scorecard goes into the docs (docs.atomus.io/ai/evals/). No run has been published yet.
