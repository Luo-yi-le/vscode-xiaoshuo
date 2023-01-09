class vscodeInterpreter {
    // eslint-disable-next-line no-undef
    vscode = window['$vscode'];
    on(cmd, data = {}) {
        if (typeof this.vscode.postMessage === 'undefined') {
            return;
        }
        this.vscode.postMessage({
            command: cmd,
            data: data
        });
    }
}

// eslint-disable-next-line no-undef
window['vscodeInterpreter'] = vscodeInterpreter