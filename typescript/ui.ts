const dialog = document.querySelector('#dialog') as HTMLElement;
const fileInput = document.querySelector('#file-input') as HTMLInputElement;

function openDialog() {
    dialog.style.visibility = 'visible';
}

function closeDialog() {
    dialog.style.visibility = 'hidden';
}

document.querySelector('#file-input-ok').addEventListener('click', () => {
    if (fileInput.files !== null && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            setGraphNodes(JSON.parse(reader.result));
            closeDialog();
        }
        reader.readAsText(fileInput.files[0]);
        return;
    }
    closeDialog();
});

document.querySelector('#change-button').addEventListener('click', openDialog);

openDialog();

onerror = alert;