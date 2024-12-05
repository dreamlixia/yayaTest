/**
 * webview 显示动态内容, 调用gitTools类失败了，执行插件直接报错⚠️
 */
import { spawn } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'test.helloWorld',
    () => {
      // 创建一个 weilcome
      const panel = vscode.window.createWebviewPanel(
        'gitBranch', // webview面板的类型, 内部使用
        '查看项目分支', // table 标题
        vscode.ViewColumn.One, // 显示在第一个编辑器
        {
          enableScripts: true, // 控制脚本是否在webview内容中启用, 默认为false(脚本禁用)
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        }
      );
	  const git = new GitTools(vscode.workspace!.workspaceFolders![0].uri.fsPath);
	  git.branch().then((res)=>{
		console.log(res);
	  	panel.webview.html = `<div>111111 11111 11111</div>
        <div>welcome to vscode! </div>
        <p>${res}</p>`;
	  });
    }
  );
  context.subscriptions.push(disposable);
}

class GitTools {
    private cwd: string;
    private user: string;
  constructor(cwd: string) {
    this.cwd = cwd;
    this.user = '';
  }
  async branch(){
	const res = await this.runGitCommand('git branch');
	return res;
  }
  runGitCommand(command:string) {
    return new Promise((resolve, reject) => {
      var process = spawn(command, {
        cwd: this.cwd,
        shell: true,
      });

      var logMessage = `${command}`;
      var cmdMessage = '';

      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on('close', (data) => {
        console.log(`${logMessage} close ---`, data);
        if (data) {
          reject(`${logMessage} error2 ! ${data}`);
        } else {
          console.log(`${logMessage} success !`);
          resolve(cmdMessage);
        }
      });
    });
  }
}

export function deactivate() {}
