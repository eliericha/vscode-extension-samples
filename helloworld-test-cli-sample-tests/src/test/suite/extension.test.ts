import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
import * as vscode from 'vscode';

// Import the extension to test it
import * as myExtension from 'helloworld-sample/src/extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(myExtension.someFunction(), 'hello');
	});
});
