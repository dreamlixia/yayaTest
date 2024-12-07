/**
 * treeView 左侧框打开 git user list
 * 打开新的标签页 获取信息并放入 html
 * 获取 userName，并右下角提示
 */
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';

export function activate(context: vscode.ExtensionContext) {
    // 创建treeView
    const treeDataProvider = new TreeProvider();
    const treeView = vscode.window.createTreeView('git-userlist-test', {
      treeDataProvider
    });
    context.subscriptions.push(treeView);
    vscode.commands.registerCommand('git-userlist-test.refresh', () => treeDataProvider.refresh());

    let disposable = vscode.commands.registerCommand(
      'test.helloWorld',
      async () => {
        // 创建一个 welcome
        const panel = vscode.window.createWebviewPanel(
          'gitBranch', // webview面板的类型, 内部使用
          '查看项目分支', // table 标题
          vscode.ViewColumn.One, // 显示在第一个编辑器
          {
            enableScripts: true, // 控制脚本是否在webview内容中启用, 默认为false(脚本禁用)
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );
        
        const git = new GitTools(
          vscode.workspace!.workspaceFolders![0].uri.fsPath
        );
        
        const userList: string = (await git.allUser()) as string;
        const result = userList?.split('\n')?.filter(Boolean)?.join()?.trim();

        git.branch().then((res) => {
          console.log(res);
          panel.webview.html = `<h1>hello world</h1>
          <div>welcome to vscode! </div>
          <p>${res}</p>
          ${result}`;
        });
      }
    );
    context.subscriptions.push(disposable,
      // 为了简便，直接添加事件注册
        vscode.commands.registerCommand(`userList.add`, () => {
        console.log(vscode.workspace!.workspaceFolders![0].uri.fsPath, 'add to git');
        vscode.window.showInformationMessage(vscode.workspace!.workspaceFolders![0].uri.fsPath, 'add to git');
      }),
      vscode.commands.registerCommand(`userList.item.check`, async (user) => {
        const panel1 = vscode.window.createWebviewPanel(
          'useList', // webview面板的类型, 内部使用
          '查看啥', // table 标题
          vscode.ViewColumn.Two, // 显示在第一个编辑器
          {
            enableScripts: true, // 控制脚本是否在webview内容中启用, 默认为false(脚本禁用)
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders?.length > 0) {
          const workspacePath = workspaceFolders[0].uri.fsPath;
          const git: SimpleGit = simpleGit(workspacePath);
          const userName = await git.raw(['config', 'user.name']);
          const userInfo = `${userName?.trim()}`
          panel1.webview.html = `<div>shishi</div>${userInfo}`;
          vscode.window.showInformationMessage(`Hello ${userName}!`);
        }
        // panel1.webview.html = `<div>shshsaha</div>${user}`;
        // vscode.window.showErrorMessage('1234');
        // vscode.window.showInformationMessage(user);
        // let userName = user.label.split(' ')[0];
        // console.log(user, 'checkcheckcheckcheck');
      })
    );
}  
  
class TreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    // 创建一个事件发射器，用于通知树数据发生变化
    private _onDidChangeTreeData: vscode.EventEmitter<
      vscode.TreeItem | undefined
    > = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    // 定义一个只读的事件，允许外部订阅树数据变化事件
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> =
      this._onDidChangeTreeData.event;
  
    // 定义刷新方法，用于通知视图数据发生变化
    refresh(): void {
      this._onDidChangeTreeData.fire(undefined);
    }
  
    // 获取树中的单个项目，这里可以定义如何显示单个项目
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
      return element;
    }
  
    // 获取树的子元素，可以是一个异步操作
    getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
      return new Promise(async (resolve, reject) => {
        const gitTool = new GitTools(
          vscode.workspace.workspaceFolders![0].uri.fsPath
        );
        const userList: string = (await gitTool.allUser()) as string;
        const result = userList
          .split('\n')
          .filter(Boolean)
          .map((item: string) => {
            return new vscode.TreeItem(
              item,
              vscode.TreeItemCollapsibleState.None
            );
          });
        resolve(result);
      });
    }


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
  async allUser() {
    // git log --pretty=format:"%an <%ae>"| sort -u
    try {
      const res = await this.runGitCommand(
        `git log --pretty=format:"%an <%ae>"| sort -u`
      );
      return res;
    } catch (err) {
      console.error(err);
    }
    return false;
  }
  
  runGitCommand(command:string) {
    return new Promise((resolve, reject) => {
      var process = spawn(command, {
        cwd: this.cwd,
        shell: true,
      });

      var logMessage = `${command}`;
      var cmdMessage = '';

      process.stdout.on('data', (data: any) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on('close', (data: any) => {
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