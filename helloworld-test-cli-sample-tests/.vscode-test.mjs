import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	extensionDevelopmentPath: '../helloworld-test-cli-sample',
});
