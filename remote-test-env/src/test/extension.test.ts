import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	function waitForFile(filePath: string, timeoutMs = 5000): Promise<string> {
		const start = Date.now();
		return new Promise((resolve, reject) => {
			const check = () => {
				if (fs.existsSync(filePath)) {
					return resolve(fs.readFileSync(filePath, 'utf8'));
				}
				if (Date.now() - start > timeoutMs) {
					return reject(new Error(`Timed out waiting for file: ${filePath}`));
				}
				setTimeout(check, 100);
			};
			check();
		});
	}

	// Test 1: Check TEST_SENTINEL in process.env
	test('Process env TEST_SENTINEL', () => {
		assert.ok(process.env.TEST_SENTINEL, 'TEST_SENTINEL should be defined');
	});

	// Test 2: Check TEST_SENTINEL via extension command
	test('Extension command returns TEST_SENTINEL', async () => {
		const result = await vscode.commands.executeCommand('remote-test-env.getEnvVar');
		assert.ok(result, 'Command should return a value');
		assert.strictEqual(typeof result, 'string', 'Command should return a string');
		assert.notStrictEqual(
			result,
			'<undefined>',
			'Command should not return "<undefined>"',
		);
		assert.strictEqual(
			result,
			'sentinel_value',
			'Extension command should return TEST_SENTINEL',
		);
	});

	// Test 3: Check TEST_SENTINEL via sentinel task (fixed: validate output file)
	test('Sentinel task writes TEST_SENTINEL file', async function () {
		this.timeout(10000);
		assert.ok(workspaceRoot, 'Workspace root should be available');

		const tasks = await vscode.tasks.fetchTasks({ type: 'sentinel' });
		const task = tasks.find((t) => t.name === 'Echo TEST_SENTINEL');
		assert.ok(task, 'Sentinel task should be found');

		const onEnd = new Promise<void>((resolve) => {
			const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
				if (e.execution.task === task) {
					disposable.dispose();
					resolve();
				}
			});
		});

		await vscode.tasks.executeTask(task!);
		await onEnd;

		const outPath = path.join(workspaceRoot!, '.env-inspect-task.txt');
		const content = await waitForFile(outPath, 5000);
		assert.ok(
			content.includes('TEST_SENTINEL='),
			'Task output file should contain TEST_SENTINEL',
		);
		assert.ok(
			content.includes(process.env.TEST_SENTINEL || ''),
			'Task output should include TEST_SENTINEL value',
		);
	});

	// New Test 4: Command writes inspection file
	test('Extension command writes inspection file with TEST_SENTINEL', async function () {
		this.timeout(10000);
		assert.ok(workspaceRoot, 'Workspace root should be available');

		const result = await vscode.commands.executeCommand('remote-test-env.getEnvVar');
		assert.ok(result && typeof result === 'string', 'Command should return a string');
		assert.strictEqual(
			result,
			'sentinel_value',
			'Extension command should return TEST_SENTINEL',
		);

		const outPath = path.join(__dirname, '../../.env-inspect-command.txt');
		const content = await waitForFile(outPath, 5000);
		assert.ok(
			content.includes('TEST_SENTINEL='),
			'Command output file should contain TEST_SENTINEL',
		);
		assert.ok(
			content.includes(result as string),
			'Command output should include returned value',
		);
	});

	// New Test 5: Hello World command is registered and callable
	test('Hello World command executes', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(
			commands.includes('remote-test-env.helloWorld'),
			'Hello World command should be registered',
		);
		await vscode.commands.executeCommand('remote-test-env.helloWorld');
	});
});
