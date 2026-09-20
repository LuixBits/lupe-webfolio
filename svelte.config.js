import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// adapter-node: builds a standalone Node server (build/index.js) run as a
		// systemd unit behind Traefik. Reads HOST/PORT/ORIGIN from the env.
		// precompress: ship .br/.gz next to every asset so the node server sends
		// compressed responses even without a compressing proxy in front.
		adapter: adapter({ precompress: true })
	}
};

export default config;
