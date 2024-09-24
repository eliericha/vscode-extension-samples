import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', function () {
	vscode.window.showInformationMessage('Start all tests.');

	this.beforeAll(async function () {
		const ext = vscode.extensions.getExtension('hello.test-env');
		assert.ok(ext);
		await ext!.activate();
	});

	test('Process env test', () => {
		for (const varName of [
			// 'VAR_IN_MJS_PROCESS_ENV',
			// 'VAR_IN_MJS_CONFIG',
			// 'VAR_IN_DEBUG_OPTS_ENV',
			'VAR_IN_LAUNCH_CONFIG',
			'VAR_IN_ENV_FILE',
		]) {
			assert.strictEqual(
				process.env[varName],
				'hello',
				`Env var '${varName}' not passed`
			);
		}
	});

	test('Task env test without process.env copy', async function () {
		await runTest(undefined, 'VAR_IN_ENV_FILE');
	});

	test('Task env test with process.env copy', async function () {
		await runTest(copyProcessEnv(), 'VAR_IN_ENV_FILE');
	});

	test('Task env test on different variable', async function () {
		await runTest(undefined, 'VAR_IN_LAUNCH_CONFIG');
	});

	test('Task env test on different variable and env copy', async function () {
		await runTest(copyProcessEnv(), 'VAR_IN_LAUNCH_CONFIG');
	});

	test('Task env after process.env modification', async function () {
		const varName = 'SOME_NEW_VAR';
		process.env[varName] = 'hello';
		await runTest(undefined, varName);
	});
});

/**
 * Construct a {[string]: string} env based on process.env
 */
function copyProcessEnv(): { [key: string]: string } {
	return Object.fromEntries(
		Object.entries(process.env)
			.filter((entry) => entry[0] && entry[1])
			.map((entry) => [entry[0], entry[1]!])
	);
}

async function runTest(env: { [key: string]: string } | undefined, varName: string) {
	/**
	 * Run a task that checks if the env var was inherited correctly.
	 */
	const taskDef = {
		type: 'process',
		command: 'test',
		args: [`"$${varName}"`, '=', '"hello"'],
		cwd: process.cwd(),
	};

	const options: vscode.ShellExecutionOptions = {
		cwd: taskDef.cwd,
	};
	if (env) {
		options.env = env;
	}

	const task = new vscode.Task(
		taskDef,
		vscode.TaskScope.Global,
		'My Task',
		'My Extension',
		new vscode.ShellExecution(taskDef.command, taskDef.args, options)
	);

	const exitCode = await new Promise<number>((resolve) => {
		const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
			if (e.execution.task === task) {
				disposable.dispose();
				resolve(e.exitCode ?? 42);
			}
		});

		void vscode.tasks.executeTask(task);
	});

	assert.equal(exitCode, 0);
}
