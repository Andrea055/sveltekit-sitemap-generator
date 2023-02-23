# Sveltekit Sitemap Generator

Generate sitemap from sveltekit project.

## Usage

Just import this plugin in your vite.config.ts and start server

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Sitemap } from 'vite-plugin-svelte-sitemap';

export default defineConfig({
	plugins: [sveltekit(), Sitemap({
		baseurl: "http://example.com"   // Don't put trailing slash at the end
	})]
});

```

Check demo folder for more information
### Credits

Plugin template from: https://github.com/wesbos/vite-plugin-list-directory-contents