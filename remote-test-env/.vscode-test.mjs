import { defineConfig } from '@vscode/test-cli';
import * as dotenv from 'dotenv';

dotenv.config({ override: true, quiet: true });

/**
 * The following line makes the env var available in non-debug test executions.
 *
 * Debug executions take their env from the extension-test-runner.debugOptions setting.
 */
process.env.SOME_VAR = 'hello';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	workspaceFolder: './test-ws',
	launchArgs: [
		// It's important to use the --user-data-dir=<path> form. The
		// --user-data-dir <path> form sometimes gets <path> considered
		// as another workspace root directory.
		// `--user-data-dir=${tmpdir}`,

		// Disable other extensions for speed
		'--disable-extensions',
	],
});
