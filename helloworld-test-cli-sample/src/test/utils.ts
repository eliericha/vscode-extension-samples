import assert = require('assert');
import * as vscode from 'vscode';

export function getWsName() {
	assert(vscode.workspace.workspaceFolders !== undefined);
	return vscode.workspace.workspaceFolders[0].name;
}
