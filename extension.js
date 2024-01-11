// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// Fonction pour récupérer le dictionnaire à partir du fichier JSON
function getLangageCommentaires() {
    return {
        "python": "#",
        "javascript": "//",
        "java": "//",
        "c": "//",
        "c++": "//",
        "c#": "//",
        "swift": "//",
        "typescript": "//",
        "php": "//",
        "ruby": "#",
        "html": "<!--",
        "css": "/*",
        "go": "//",
        "rust": "//",
        "kotlin": "//",
        "dart": "//",
        "scala": "//",
        "perl": "#",
        "lua": "--",
        "r": "#",
        "shell": "#",
        "matlab": "%",
        "objective-c": "//",
        "groovy": "//",
        "haskell": "--",
        "vb": "'",
        "fortran": "!",
        "cobol": "*",
        "ada": "--",
        "verilog": "//",
        "sql": "--",
        "assembly": "//",
        "powershell": "#",
        "typescript": "//",
        "f#": "//",
        "elixir": "#",
        "erlang": "%",
        "ocaml": "//",
        "racket": ";",
        "lisp": ";;",
        "prolog": "%",
        "bash": "#",
        "shell": "#",
        "dart": "//",
        "julia": "#",
        "smalltalk": "\"",
        "scheme": ";;"
      };
}

const CONFIG_KEY_NAME = 'chatpilot.greetingName';
const CONFIG_KEY_CHECKBOX = 'chatpilot.showWelcomeCheckbox';
const langages = getLangageCommentaires()

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log("activate")

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
    return langages[languageId]
}

function isComment(text, languageId) {
    let commentSymbol = getCommentSymbol(languageId)
    if (text.startsWith(commentSymbol)) {
        return true
    } else {
        return false
    }
}


function deactivate() {}


// Ajouter une commande pour gérer le clic sur la décoration
vscode.commands.registerCommand('extension.showComment', () => {
    let editor = vscode.window.activeTextEditor;
    let lineNumber = editor.selection.active.line;
    const lineText = editor.document.lineAt(lineNumber).text;

    if (isComment(lineText, editor.document.languageId)) {
        console.log(`Contenu du commentaire : ${lineText}`);
    } else {
        console.log("Not a comment!")
    }

});

module.exports = {
    activate,
    deactivate
};
