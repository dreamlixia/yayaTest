/**
 * 弹出当前分支名
 */

import simpleGit, { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('test.helloWorld', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspacePath = workspaceFolders[0].uri.fsPath;
      const git: SimpleGit = simpleGit(workspacePath);

      try {
        // 检查是否是一个 Git 仓库
        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
          vscode.window.showErrorMessage('当前工作区不是一个 Git 仓库');
          return;
        }

        // 获取分支信息
        const branchSummary = await git.branch();
        const currentBranch = branchSummary.current;

        if (currentBranch) {
          vscode.window.showInformationMessage(`当前分支: ${currentBranch}`);
        } else {
          vscode.window.showErrorMessage('无法获取当前分支');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`获取当前分支失败: ${error.message}`);
      }
    } else {
      vscode.window.showInformationMessage('No workspace folder open');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}