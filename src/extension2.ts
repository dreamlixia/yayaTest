/**
 * 创建html页面
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'test.helloWorld',
    () => {
      	const content = `<!DOCTYPE html>
			<html>
			<head>
			<title></title>
			</head>
			<body>
				<h1>Hello World</h1>
				<div>vscode plugin create html page</div>

			</body>
			</html>
		`;
		// 获取项目路径地址
		const uri = vscode.workspace!.workspaceFolders![0].uri.fsPath;
		vscode.window.showInformationMessage('uri='+`${uri}`);
		console.log(uri);
		fs.writeFile(path.join(uri, 'index.html'), content, (err) => {
			if (err) {
				vscode.window.showErrorMessage('创建失败');
			}
			vscode.window.showInformationMessage('创建成功');
		});
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}

