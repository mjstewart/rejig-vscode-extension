// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec } from "promisify-child-process";
import { execFile } from "child_process";
import { Range, TextDocument } from "vscode";

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
			const fullRange: Range = fullDocumentRange(editor.document);
      console.log(editor.document.uri.fsPath);
			console.log(editor.document.languageId);

      try {
        // const child = exec('/home/matt/dev/rejig/build/rejig --stdin', [);
        const child = execFile(
          "/home/matt/dev/rejig/build/rejig",
          ["--stdin", `--${editor.document.languageId}`],
          { encoding: "utf-8" }
				);


				child.stdin?.write(editor.document.getText()); //document.getText());
				child.stdin?.end();

				child.stdout?.on('data', data => {
					// console.log(data)
					editor.edit(editBuilder => {
						editBuilder.replace(fullRange, data);
					});
				})
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
