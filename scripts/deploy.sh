#!/bin/sh
# Publish dist/ to the gh-pages branch (GitHub Pages).
set -e
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name || echo deploy)" -c user.email="$(git -C .. config user.email || echo deploy@local)" commit -q -m "Deploy KUPPA to GitHub Pages"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
