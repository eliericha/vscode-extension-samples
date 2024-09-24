import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Process env test', () => {
		assert.strictEqual(process.env.SOME_VAR, 'hello');
	});

	test('Task env test', async function () {
		this.timeout('10s');

		const taskDef = {
			type: 'process',
			command: 'test',
			args: ['"$SOME_VAR"', '=', '"hello"'],
			cwd: process.cwd(),
		};

		const task = new vscode.Task(
			taskDef,
			vscode.TaskScope.Global,
			'My Task',
			'My Extension',
			new vscode.ShellExecution(taskDef.command, taskDef.args, {
				cwd: taskDef.cwd,
			})
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
	});
});
