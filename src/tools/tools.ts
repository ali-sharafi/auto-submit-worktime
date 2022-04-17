let res = document.removeEventListener('mouseup', () => { });
console.log('res: ', res);
document.addEventListener('mouseup', (e) => {
    let selected = document.getSelection();
    if (selected)
        console.log('selected: ', selected.toString());
})