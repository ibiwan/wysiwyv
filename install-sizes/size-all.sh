rm -rf node_modules package.json package-lock.json
npm init -y
npm i wysiwyv
npx esbuild entry-none.ts --bundle --minify --format=esm --platform=browser | gzip -9 | wc -c
npx esbuild entry-one.ts --bundle --minify --format=esm --platform=browser | gzip -9 | wc -c
npx esbuild entry-some.ts --bundle --minify --format=esm --platform=browser | gzip -9 | wc -c
npx esbuild entry-full.ts --bundle --minify --format=esm --platform=browser | gzip -9 | wc -c
