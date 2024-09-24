import { defineConfig } from '@vscode/test-cli';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * The following line makes the env var available in non-debug test executions,
 * but not in debug test executions.
 */
process.env.VAR_IN_MJS_PROCESS_ENV = 'hello';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	/**
	 * The following makes the env var available for both non-debug and debug
	 * test executions.
	 *
	 * However tasks launched by a test don't inherit that environment.
	 */
	env: {
		VAR_IN_MJS_CONFIG: 'hello',
	},
});
