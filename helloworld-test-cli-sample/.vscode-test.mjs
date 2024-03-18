import { defineConfig } from '@vscode/test-cli';
import { mkdtempSync } from 'fs';

export default defineConfig([
	{
		files: 'out/test/suite1/**/*.test.js',
		workspaceFolder: 'ws-suite1',
	},
	{
		files: 'out/test/suite2/**/*.test.js',
		workspaceFolder: 'ws-suite2',
	},
]);
