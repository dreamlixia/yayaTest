/**
 * webview 
 */
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'test.helloWorld',
    () => {
      // 创建一个 weilcome
      const panel = vscode.window.createWebviewPanel(
        'welcome', // webview面板的类型, 内部使用
        '自定义欢迎页面标题', // table 标题
        vscode.ViewColumn.One, // 显示在第一个编辑器
        {
          enableScripts: true, // 控制脚本是否在webview内容中启用, 默认为false(脚本禁用)
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        }
      );
	  panel.webview.html = `<h1>hello world</h1><div>welcome to vscode!</div><div>vscode plugin create html page</div>`;
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
