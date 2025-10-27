import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', function () {
	this.timeout(
		// Both of these expressions cause an error in
		// the extraction of tests. Initially I thought
		// it was the use of 'Math' but the second expression
		// shows that it wasn't the issue.
		Math.max(5, this.timeout())
		// this.timeout() > 5 ? this.timeout() : 5
	);

	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});
});
