import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { fontFamily: { display: ['var(--font-syne)'], body: ['var(--font-sora)'] }, boxShadow: { glaze: '0 22px 55px rgba(36, 31, 28, .12)' } } }, plugins: [] };
export default config;
