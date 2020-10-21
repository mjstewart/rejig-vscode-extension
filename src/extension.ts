// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec } from "promisify-child-process";
import { execFile } from "child_process";
import { Range, TextDocument } from "vscode";

interface RejigSettings {
  prefixGroups: String[];
  displayImportGroupTitles: Boolean;
  displayImportBorderTop: Boolean;
  displayImportBorderBottom: Boolean;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "rejig-vscode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "rejig-vscode.runFormatter",
    () => {
      // The code you place here will be executed every time your command is executed

      if (!vscode.window.activeTextEditor) {
        return;
      }

      const editor = vscode.window.activeTextEditor;
      const fullRange = fullDocumentRange(editor.document);

      try {
        const args = [];
        const config = vscode.workspace.getConfiguration("rejig");

        // cli args requires each element to be in string sep by whitespace
        if (config.prefixGroups.length > 0) {
          args.push("--prefixes", config.prefixGroups?.join(" "));
        }

        // remaining config are all flags, if provided setting is enabled
        if (config.displayImportGroupTitles) {
          args.push("--titles");
        }
        if (config.displayImportBorderTop) {
          args.push("--border-top");
        }
        if (config.displayImportBorderBottom) {
          args.push("--border-bottom");
        }
        args.push("--stdin");
        args.push(`--${editor.document.languageId}`);

        console.log(args);
        const child = execFile("/home/matt/dev/rejig/build/rejig", args, {
          encoding: "utf-8",
        });

        child.stdin?.write(editor.document.getText());
        child.stdin?.end();

        child.stdout?.on("data", (data) => {
          editor.edit((editBuilder) => {
            editBuilder.replace(fullRange, data);
          });
        });
        // console.log("write to stdin");
        // const { stdout, stderr } = await child;

        // console.log("stdout dump");
        // console.log(String(stdout?.read()));

        // console.log("stderr dump");
        // console.log(String(stderr));
      } catch (e) {}

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from rejig-vscode-extension!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// // Use the console to output diagnostic information (console.log) and errors (console.error)
// // This line of code will only be executed once when your extension is activated
// console.log('Congratulations, your extension "rejig-vscode" is now active!');

// // The command has been defined in the package.json file
// // Now provide the implementation of the command with registerCommand
// // The commandId parameter must match the command field in package.json
// let disposable = vscode.commands.registerCommand('rejig-vscode.helloWorld', () => {
// // The code you place here will be executed every time your command is executed

// // Display a message box to the user
// vscode.window.showInformationMessage('Hello World from rejig-vscode-extension!');
// });

// context.subscriptions.push(disposable);
// }

// this method is called when your extension is deactivated
export function deactivate() {}

function fullDocumentRange(document: TextDocument): Range {
  const last: number = document.lineCount - 1;
  return new Range(0, 0, last, document.lineAt(last).text.length);
}
