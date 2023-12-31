const vscode = require('vscode');

let panel;

function activate(context) {
    vscode.window.onDidChangeActiveTextEditor(updatePanelContent);
    vscode.workspace.onDidChangeTextDocument(updatePanelContent);

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showSidebar', () => {
            if (!panel) {
                // Créer une nouvelle vue dans la barre latérale
                panel = vscode.window.createWebviewPanel(
                    'sidebarSample',
                    'Sidebar Sample',
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true
                    }
                );

                // Mettre à jour le contenu initial
                updatePanelContent();

                // Gérer la fermeture du panel
                panel.onDidDispose(() => {
                    panel = undefined;
                });
            } else {
                // Si le panel est déjà ouvert, le focaliser
                panel.reveal();
            }
        })
    );
}

function updatePanelContent() {
    if (panel && panel.visible) {
        const activeEditor = vscode.window.activeTextEditor;

        let content = 'Aucun éditeur actif.';
        if (activeEditor) {
            const lineCount = activeEditor.document.lineCount;
            content = `Nombre de lignes dans le fichier actif : ${lineCount}`;
        }

        // Mettre à jour le contenu de la vue
        panel.webview.html = getWebviewContent(content);
    }
}

function getWebviewContent(content) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sidebar Sample</title>
        </head>
        <body>
            <h2>Informations</h2>
            <p>${content}</p>
            <button onclick="alert('Bouton cliqué !')">Cliquez-moi</button>
        </body>
        </html>`;
}

module.exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    if (panel) {
        panel.dispose();
    }
}

module.exports.deactivate = deactivate;
