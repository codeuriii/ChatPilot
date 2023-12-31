// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const CONFIG_KEY_NAME = 'chatpilot.greetingName';
const CONFIG_KEY_CHECKBOX = 'chatpilot.showWelcomeCheckbox';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log("activate")
    updateCommentSymbol(context); // Appel initial pour le fichier actif au démarrage de l'extension

    let userName = vscode.workspace.getConfiguration().get(CONFIG_KEY_NAME, '');
    let showWelcomeCheckbox = vscode.workspace.getConfiguration().get(CONFIG_KEY_CHECKBOX, true);

    if (!userName && showWelcomeCheckbox) {
		console.log("first start")
        vscode.window.showInformationMessage(
            'Bienvenue dans Visual Studio Code !',
            'Configurer',
            'Ne plus afficher'
        ).then((selected) => {
            if (selected === 'Configurer') {
                showConfigInput();
            } else if (selected === 'Ne plus afficher') {
                vscode.workspace.getConfiguration().update(CONFIG_KEY_CHECKBOX, false, vscode.ConfigurationTarget.Global);
            }
        });
    } else {
		console.log("already start")
        showWelcomeMessage(userName);
    }

    // Écouter les changements dans l'éditeur
    vscode.window.onDidChangeActiveTextEditor(() => {
        updateCommentSymbol(); // Appeler la fonction à chaque changement d'éditeur actif
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */

function updateCommentSymbol(context) {
    let activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
		console.log("pas de editor")
        return;
    }
	console.log("ok editor")

    let document = activeTextEditor.document;
    let languageId = document.languageId;
	// console.log(document.lineAt(1).text)
    let commentSymbol = getCommentSymbol(languageId);
	// console.log(languageId)
	// console.log(commentSymbol)

    if (commentSymbol) {
        let commentLines = getCommentOnlyLines(document, commentSymbol);
        // console.log(`Lignes avec uniquement des commentaires : \n${commentLines.map(line => line.line).join('\n')}`);

        // Effacer les décorations précédentes
        clearDecorations();
		var decorations = []

        // Ajouter des décorations pour chaque ligne avec un bouton
        commentLines.forEach((lineInfo) => {
            let lineNumber = lineInfo.lineNumber;
            let line = lineInfo.line;
            let decoration = createDecoration(lineNumber);
            decorations.push(decoration)

            // Ajouter un gestionnaire d'événements pour le clic sur la décoration
            let command = {
                command: 'extension.showComment',
                title: 'Afficher le commentaire',
                arguments: [line]
            };
            context.subscriptions.push(command);
        });
		activeTextEditor.setDecorations(decorationType, decorations);
    }
}

function getCommentOnlyLines(document, commentSymbol) {
    let commentLines = [];
    for (let i = 0; i < document.lineCount; i++) {
        let line = document.lineAt(i).text.trim();
        if (line.startsWith(commentSymbol)) {
            commentLines.push({ line: line, lineNumber: i + 1 });
        }
    }
    return commentLines;
}

function createDecoration(lineNumber) {
    let range = new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 0);
    let decoration = { range: range, renderOptions: { after: { contentText: 'aa', color: 'green' } } };
    return decoration;
}

function clearDecorations() {
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        activeTextEditor.setDecorations(decorationType, []);
    }
}

function showConfigInput() {
    vscode.window.showInputBox({
        prompt: 'Entrez votre nom',
        placeHolder: 'Nom'
    }).then((inputName) => {
        if (inputName) {
            vscode.workspace.getConfiguration().update(CONFIG_KEY_NAME, inputName, vscode.ConfigurationTarget.Global).then(() => {
                showWelcomeMessage(inputName);
            });
        }
    });
}

function showWelcomeMessage(userName) {
    vscode.window.showInformationMessage(`Bonjour ${userName} ! Bienvenue dans Visual Studio Code.`);
}

function getCommentSymbol(languageId) {
	const langages = getLangageCommentaires()
    return langages[languageId]
    
}

// Fonction pour récupérer le dictionnaire à partir du fichier JSON
function getLangageCommentaires() {
    const rawdata = fs.readFileSync('languages.json');
    const data = JSON.parse(rawdata);
    return data.langages;
  }

function deactivate() {}

const decorationType = vscode.window.createTextEditorDecorationType({});

// Ajouter une commande pour gérer le clic sur la décoration
vscode.commands.registerCommand('extension.showComment', (line) => {
    console.log(`Contenu du commentaire : ${line}`);
});

module.exports = {
    activate,
    deactivate
};
