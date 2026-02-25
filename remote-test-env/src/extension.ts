// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "remote-test-env" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('remote-test-env.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from remote-test-env!');
	});

	// Command to get the sentinel environment variable and write it to a file
	const getEnvVarDisposable = vscode.commands.registerCommand('remote-test-env.getEnvVar', async () => {
		const sentinel = process.env.TEST_SENTINEL || '<undefined>';
		vscode.window.showInformationMessage(`TEST_SENTINEL: ${sentinel}`);
		// Write to file for inspection in workspace root
		const fs = await import('fs');
		const path = await import('path');
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length !== 1) {
			throw new Error('Expected a single workspace root');
		}
		const outPath = path.join(workspaceFolders[0].uri.fsPath, '.env-inspect-command.txt');
		fs.writeFileSync(outPath, `TEST_SENTINEL=${sentinel}\n`);
		return sentinel;
	});

	// TaskProvider to provide a task that echoes and writes the sentinel variable
	const taskProvider = vscode.tasks.registerTaskProvider('sentinel', {
		provideTasks: () => {
			// Write to .env-inspect-task.txt in the workspace root
			const writeCmd = 'echo TEST_SENTINEL=$TEST_SENTINEL > .env-inspect-task.txt && echo $TEST_SENTINEL';
			const task = new vscode.Task(
				{ type: 'sentinel' },
				vscode.TaskScope.Workspace,
				'Echo TEST_SENTINEL',
				'sentinel',
				new vscode.ShellExecution(writeCmd),
				[]
			);
			return [task];
		},
		resolveTask(_task: vscode.Task): vscode.Task | undefined {
			return undefined;
		}
	});

	context.subscriptions.push(disposable, getEnvVarDisposable, taskProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
