// Checks every post in content/blog (or BLOG_CONTENT_DIR) against the rules in
// src/blog/validate.ts and exits non-zero on any problem. `npm run build` runs
// it before anything is rendered; the rules are documented in content/blog/README.md.
import { relative, resolve } from 'node:path';
import { runnerImport } from 'vite';

const root = resolve(import.meta.dirname, '..');

// The rules are TypeScript, shared with the build; Vite loads them as-is.
const { module: load } = await runnerImport(resolve(root, 'src/blog/load.ts'), {
  root,
  configFile: false,
  logLevel: 'error',
});

const blog = load.loadBlog(load.contentDir(root));
const where = relative(root, blog.dir) || '.';

if (blog.errors.length) {
  console.error(`blog:check found ${blog.errors.length} problem(s) in ${where}:`);
  for (const e of blog.errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

const state = blog.config.publishing ? 'publishing on' : 'publishing OFF';
const note = blog.config.aiNote ? 'AI note on' : 'AI note off';
console.log(`blog:check ok: ${blog.posts.length} post(s) in ${where} (${state}, ${note})`);
for (const p of blog.posts) {
  console.log(`  ✓ ${p.date} ${p.slug} (${p.words} words, ${p.tags.join(', ')})`);
}
