const vscode = require('vscode');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showGreetingPopup', (lineNumber, lineContent) => {
            const greetingMessage = `Salut ! Contenu de la ligne ${lineNumber}: ${lineContent}`;
            
            vscode.window.showInformationMessage(greetingMessage, 'Log dans la console').then((selected) => {
                if (selected === 'Log dans la console') {
                    console.log(greetingMessage);
                }
            });
        })
    );

    let disposable = vscode.commands.registerCommand('extension.showContextMenu', (editor) => {
        const lineNumber = editor.selection.start.line + 1;
        const lineContent = editor.document.lineAt(editor.selection.start.line).text;

        vscode.window.showInformationMessage(
            'Cliquez pour afficher le salut',
            { modal: false },
            'Salut'
        ).then((selection) => {
            if (selection === 'Salut') {
                vscode.commands.executeCommand('extension.showGreetingPopup', lineNumber, lineContent);
            }
        });
    });

    vscode.window.onDidChangeTextEditorSelection((event) => {
        if (event.selections.length === 1) {
            const editor = vscode.window.activeTextEditor;
            contextMenuDisposable.dispose();
            contextMenuDisposable = vscode.commands.registerCommand('extension.showContextMenu', () => {
                disposable.dispose();
                contextMenuDisposable.dispose();
                vscode.commands.executeCommand('extension.showContextMenu', editor);
            });
            context.subscriptions.push(contextMenuDisposable);
        }
    });

    let contextMenuDisposable = vscode.commands.registerCommand('extension.showContextMenu', () => {
        const editor = vscode.window.activeTextEditor;
        disposable.dispose();
        contextMenuDisposable.dispose();
        vscode.commands.executeCommand('extension.showContextMenu', editor);
    });

    context.subscriptions.push(disposable, contextMenuDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}