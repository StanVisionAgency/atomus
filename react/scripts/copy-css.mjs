import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
copyFileSync('src/styles.css', 'dist/styles.css');
copyFileSync('../css/atomus.css', 'dist/atomus.css');
console.log('Copied styles.css and atomus.css into dist/');
