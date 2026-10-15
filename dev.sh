#!/bin/sh
# Run both static pages and Vercel Functions on the same local origin.
cd -- "$(dirname -- "$0")" || exit 1
exec npx --yes vercel@64.0.2 dev --listen 4173 --yes
