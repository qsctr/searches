'use strict';

const startTextfield = document.querySelector('#start-textfield');
const startInput = document.querySelector('#start') as HTMLInputElement;
const goalInput = document.querySelector('#goal') as HTMLInputElement;
const choiceContainer = document.querySelector('#choice-container');
const dlsRecLabel = document.querySelector('#dls-rec-label');
const dlsRecRadio = document.querySelector('#dls-rec') as HTMLInputElement;
const dlsLimitInput = document.querySelector('#dls-limit') as HTMLInputElement;
const fileNameElem = document.querySelector('#current-file-name');
const logElem = document.querySelector('#log');
const searchButton = document.querySelector('#search-button') as HTMLButtonElement;
const dialog = document.querySelector('#dialog') as HTMLElement;
const fileInput = document.querySelector('#file-input') as HTMLInputElement;
const fileInputOk = document.querySelector('#file-input-ok') as HTMLButtonElement;
const snackbar = document.querySelector('#snackbar') as MDLSnackbarElement;

onerror = message => snackbar.MaterialSnackbar.showSnackbar({
    message: message,
    timeout: message.length * 60 + 2500
});

const idToFunc: { [id: string]: Function } = {
    'bfs-rec': bfsRec,
    'bfs-no-rec': bfsNoRec,
    'dfs-rec': dfsRec,
    'dfs-no-rec': dfsNoRec,
    'dls-rec': dlsRec,
    'ids-rec': idsRec,
    'ids-no-rec': idsNoRec
};

function println(message: string) {
    logElem.textContent += message + '\n';
}

function dlsLimitInputValid() {
    return !dlsRecRadio.checked ||
        (dlsLimitInput.validity.valid && dlsLimitInput.value !== '');
}

function updateSearchButton() {
    searchButton.disabled = startInput.value === ''
        || currentGraphNodes.find(node => node.data === startInput.value) === undefined
        || !dlsLimitInputValid();
}

function openDialog() {
    dialog.style.visibility = 'visible';
}

function closeDialog() {
    dialog.style.visibility = 'hidden';
}

startTextfield.addEventListener('mdl-componentupgraded', () => {
    (startTextfield as any).MaterialTextfield.checkValidity = () => {
        const startEmpty = startInput.value === '';
        const startValid = currentGraphNodes.find(node =>
            node.data === startInput.value) !== undefined;
        if (startValid || startEmpty) {
            startTextfield.classList.remove('is-invalid');
        } else {
            startTextfield.classList.add('is-invalid');
        }
        searchButton.disabled = startEmpty || !startValid || !dlsLimitInputValid();
    };
});

choiceContainer.addEventListener('click', updateSearchButton);

dlsRecLabel.addEventListener('click', () => {
    dlsLimitInput.focus();
});

dlsLimitInput.addEventListener('input', updateSearchButton);

searchButton.addEventListener('click', () => {
    logElem.textContent = '';
    const func = idToFunc[Object.keys(idToFunc).find(id =>
        (document.querySelector(`#${id}`) as HTMLInputElement).checked) as string];
    const root = currentGraphNodes.find(node => node.data === startInput.value) as GraphNode;
    const res: boolean | null = func === dlsRec ?
        dlsRec(root, parseInt(dlsLimitInput.value), goalInput.value) :
        func(root, goalInput.value);
    clearVisited();
    if (goalInput.value !== '') {
        if (res === null) {
            println('--> No solution found within the depth limit');
        } else if (res) {
            println('--> Solution found');
        } else {
            println('--> No solution found');
        }
    }
});

document.querySelector('#change-button').addEventListener('click', openDialog);

fileInputOk.addEventListener('click', () => {
    const reader = new FileReader();
    const file = (fileInput.files as FileList)[0];
    reader.onload = () => {
        setGraphNodes(JSON.parse(reader.result));
        closeDialog();
        fileNameElem.textContent = file.name;
    };
    reader.readAsText(file);
    return;
});

fileInput.addEventListener('change', () => {
    fileInputOk.disabled = fileInput.files === null || fileInput.files.length === 0;
});

openDialog();

document.body.classList.add('show');