# Debug Build Error via CLI

## 1. Get the exact Vercel build error

From the **ParentSimple** directory:

```bash
cd 02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple

# Link to your Vercel project (first time only)
vercel link

# Pull project settings
vercel pull --yes

# Run the same build Vercel runs and capture output
vercel build 2>&1 | tee vercel-build.log
```

Then open `vercel-build.log` or scroll up in the terminal to see the **exact error** (e.g. module not found, type error, OOM).

## 2. Inspect a specific deployment

If you have a deployment URL or ID from the Vercel dashboard:

```bash
vercel inspect <deployment-url-or-id> --logs
```

Example:

```bash
vercel inspect parentsimple-xxx.vercel.app --logs
```

## 3. Local build (same as `npm run build`)

- **TypeScript:** `npx tsc --noEmit` — passes if no type errors.
- **ESLint:** `npm run lint` — many warnings/errors; build does **not** fail on them because `next.config.ts` has `eslint.ignoreDuringBuilds: true`.
- **Full build:** `npm run build` — can take 2–4+ minutes locally. If it hangs, the log usually stops after the "Next.js 15.x.x" line until compilation finishes.

## 4. Multiple lockfiles warning

When you run the build from inside the **CallReady** monorepo, Next.js finds both:

- `04-ParentSimple/package-lock.json`
- A lockfile in a parent directory (e.g. CallReady root)

It **selects** the parent lockfile for the warning message but still uses the **project directory** (first lockfile’s directory) as the build root. So the warning is mostly informational.

- **On Vercel:** If the connected repo is **parentsimple** only (no parent repo), there is only one lockfile and the warning does not appear.
- **Locally:** To avoid the warning, you can run the build from a copy of the project that has no parent lockfile (e.g. clone only the ParentSimple repo into a new folder and run `npm run build` there).

## 5. Quick checks that often cause build failures

- **Missing env vars:** Vercel needs the same env vars as production (e.g. Supabase, GHL webhook). Check **Project → Settings → Environment Variables**.
- **Node version:** Vercel uses the version set in **Project → Settings → General → Node.js Version** (e.g. 20.x). Match locally with `nvm use 20` if needed.
- **Import path / module not found:** Search the build log for `Module not found` or `Can't resolve` and fix the import or add the dependency.
