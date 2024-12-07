/**
 * optionList
 */

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    // 注册一个命令 learn-vscode-extends.quickPick
    const disposable = vscode.commands.registerCommand("learn-vscode-extends.quickPick", () => {
        // 打开一个快速选择列表
        vscode.window.showQuickPick(
            // ["选项一", "选项二", "选项三"], // 简单的显示多个选项
            [
                { // 对象的形式可以配置更多东西
                    label: "选项一",
                    description: "选项一描述$(bug)", // 可以指定官方提供的图标id https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
                    detail: "选项一详细信息",
                    mate: { // 这里也可以放一些自定义的对象
                        script: "learn-vscode-extends.helloWrold" 
                    },
                },
                {
                    label: "选项二",
                    description: "选项二描述",
                    detail: "选项二详细信息$(gear)",
                }
            ],
            {
                title: "请选择一个选项", // 标题
                placeHolder: "用户类型", // 占位符文本
                canPickMany: false, // 是否可以多选
            }
        ).then((res: vscode.QuickPickItem | undefined) => {
            if (!res) return;
            console.log(res); // 这里就是上面数组中对应的对象信息
        })
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }

