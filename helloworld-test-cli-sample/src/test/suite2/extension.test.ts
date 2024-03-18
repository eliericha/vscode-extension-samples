import * as assert from 'assert';
import { randomInt } from 'crypto';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getWsName } from '../utils';
// import * as myExtension from '../../extension';

suite('Extension Test Suite 2', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test 2', async () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
		assert.equal(getWsName(), 'ws-suite2');
	});
});
