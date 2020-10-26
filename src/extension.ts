// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as child_proc from "promisify-child-process";
import { Range, TextDocument } from "vscode";
import { posix } from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "rejig-vscode.runFormatter",
    async () => {
      // The code you place here will be executed every time your command is executed

      if (!vscode.window.activeTextEditor) {
        return;
      }

      const editor = vscode.window.activeTextEditor;
      const fullRange = fullDocumentRange(editor.document);
      const config = vscode.workspace.getConfiguration("rejig");

      try {
        const args = [];

        if (config.prefixGroups.length > 0) {
          // cli arg requires string
          args.push("--prefixes", config.prefixGroups?.join(" "));
        }

        if (config.displayImportGroupTitles) {
          args.push("--titles");
        }
        if (config.displayImportBorderTop) {
          args.push("--border-top");
        }
        if (config.displayImportBorderBottom) {
          args.push("--border-bottom");
        }
        args.push("--stdin", editor.document.fileName);
        args.push(`--${editor.document.languageId}`);

        const child = child_proc.execFile("rejig", args);

        child.stdin?.write(editor.document.getText());
        child.stdin?.end();

        const { stdout, stderr } = await child;
        const err = String(stderr);

        if (err.length > 0) {
          onError(config, editor, err);
          return;
        }

        const response = JSON.parse(String(stdout));

        if (response.status === "ok") {
          editor.edit((editBuilder) => {
            editBuilder.replace(fullRange, response.data);
          });
          return;
        }

        onError(config, editor, response.data);
      } catch (e) {
        onError(config, editor, e.toString());
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function fullDocumentRange(document: TextDocument): Range {
  const last: number = document.lineCount - 1;
  return new Range(0, 0, last, document.lineAt(last).text.length);
}

async function onError(
  config: vscode.WorkspaceConfiguration,
  editor: vscode.TextEditor,
  body: string
) {
  if (config.writeErrorFile) {
    const wsUri = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri;
    if (wsUri) {
      const fileUri = wsUri.with({
        path: posix.join(wsUri.path, "rejig-error.txt"),
      });
      await vscode.workspace.fs.writeFile(fileUri, Buffer.from(body, "utf8"));
      vscode.window.showErrorMessage(
        "Rejig: See 'rejig-error.txt' for details"
      );
    }
  }
}
