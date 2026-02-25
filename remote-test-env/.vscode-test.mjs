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
});
