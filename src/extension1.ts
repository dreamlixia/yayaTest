/**
 * toast
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('test.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from yayaTest!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

/**
 * 
 * 	// 获取当前工作区路径
	// const workspaceFolders = vscode.workspace.workspaceFolders;
	// if (workspaceFolders && workspaceFolders.length > 0) {
	//   const workspacePath = workspaceFolders[0].uri.fsPath;
	//   vscode.window.showInformationMessage(`Workspace path: ${workspacePath}`);
	// } else {
	//   vscode.window.showInformationMessage('No workspace folder open');
	// }

	// panel.webview.html = `<h1>hello world</h1>
	//     <div>welcome to vscode! </div>
	//     <div>test yayaTest！</div>
	//     ${workspaceFolders?.[0]?.uri?.fsPath ?? 'well'}
	//   `;
 */
