'use strict';
var startTextfield = document.querySelector('#start-textfield');
var startInput = document.querySelector('#start');
var goalInput = document.querySelector('#goal');
var choiceContainer = document.querySelector('#choice-container');
var dlsRecLabel = document.querySelector('#dls-rec-label');
var dlsRecRadio = document.querySelector('#dls-rec');
var dlsLimitInput = document.querySelector('#dls-limit');
var fileNameElem = document.querySelector('#current-file-name');
var logElem = document.querySelector('#log');
var searchButton = document.querySelector('#search-button');
var dialog = document.querySelector('#dialog');
var fileInput = document.querySelector('#file-input');
var fileInputOk = document.querySelector('#file-input-ok');
var snackbar = document.querySelector('#snackbar');
onerror = function (message) { return snackbar.MaterialSnackbar.showSnackbar({
    message: message,
    timeout: message.length * 60 + 2500
}); };
var idToFunc = {
    'bfs-rec': bfsRec,
    'bfs-no-rec': bfsNoRec,
    'dfs-rec': dfsRec,
    'dfs-no-rec': dfsNoRec,
    'dls-rec': dlsRec,
    'ids-rec': idsRec,
    'ids-no-rec': idsNoRec
};
function println(message) {
    logElem.textContent += message + '\n';
}
function dlsLimitInputValid() {
    return !dlsRecRadio.checked ||
        (dlsLimitInput.validity.valid && dlsLimitInput.value !== '');
}
function updateSearchButton() {
    searchButton.disabled = startInput.value === ''
        || currentGraphNodes.find(function (node) { return node.data === startInput.value; }) === undefined
        || !dlsLimitInputValid();
}
function openDialog() {
    dialog.style.visibility = 'visible';
}
function closeDialog() {
    dialog.style.visibility = 'hidden';
}
startTextfield.addEventListener('mdl-componentupgraded', function () {
    startTextfield.MaterialTextfield.checkValidity = function () {
        var startEmpty = startInput.value === '';
        var startValid = currentGraphNodes.find(function (node) {
            return node.data === startInput.value;
        }) !== undefined;
        if (startValid || startEmpty) {
            startTextfield.classList.remove('is-invalid');
        }
        else {
            startTextfield.classList.add('is-invalid');
        }
        searchButton.disabled = startEmpty || !startValid || !dlsLimitInputValid();
    };
});
choiceContainer.addEventListener('click', updateSearchButton);
dlsRecLabel.addEventListener('click', function () {
    dlsLimitInput.focus();
});
dlsLimitInput.addEventListener('input', updateSearchButton);
searchButton.addEventListener('click', function () {
    logElem.textContent = '';
    var func = idToFunc[Object.keys(idToFunc).find(function (id) {
        return document.querySelector("#" + id).checked;
    })];
    var root = currentGraphNodes.find(function (node) { return node.data === startInput.value; });
    var res = func === dlsRec ?
        dlsRec(root, parseInt(dlsLimitInput.value), goalInput.value) :
        func(root, goalInput.value);
    clearVisited();
    if (goalInput.value !== '') {
        if (res === null) {
            println('--> Goal not found within the depth limit');
        }
        else if (res) {
            println('--> Goal found');
        }
        else {
            println('--> Goal not found');
        }
    }
});
document.querySelector('#change-button').addEventListener('click', openDialog);
fileInputOk.addEventListener('click', function () {
    var reader = new FileReader();
    var file = fileInput.files[0];
    reader.onload = function () {
        setGraphNodes(JSON.parse(reader.result));
        closeDialog();
        fileNameElem.textContent = file.name;
    };
    reader.readAsText(file);
    return;
});
fileInput.addEventListener('change', function () {
    fileInputOk.disabled = fileInput.files === null || fileInput.files.length === 0;
});
openDialog();
document.body.classList.add('show');
