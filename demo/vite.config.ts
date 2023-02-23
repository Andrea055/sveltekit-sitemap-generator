import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Sitemap } from '../plugin.js';

export default defineConfig({
	plugins: [sveltekit(), Sitemap({
		baseurl: "http://localhost:5173"
	})]
});
