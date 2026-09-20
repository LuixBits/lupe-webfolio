import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// adapter-node: builds a standalone Node server (build/index.js) run as a
		// systemd unit behind Traefik. Reads HOST/PORT/ORIGIN from the env.
		adapter: adapter()
	}
};

export default config;
