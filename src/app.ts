class Translator {
    wordsList: Array<string>;

    constructor() {
        this.registerListener();
        this.wordsList = [];
    }

    registerListener(): void {
        document.addEventListener('mouseup', () => this.handleSelectedText());
    }

    handleSelectedText(): void {
        let selected = document.getSelection()?.toString().trim();
        if (selected && this.isSelectedValid(selected)) {
            this.wordsList.push(selected);
            this.createModal()
        }
    }

    createModal() {
        if (document.querySelector('.translator-wraper')) return;
        
        let divWraper = document.createElement('div');
        divWraper.className = 'translator-wraper';
        document.body.append(divWraper);
    }

    isSelectedValid(selected: string): boolean {
        return !!(isNaN(Number(selected)) && this.wordsList.indexOf(selected) === -1)
    }
}

export default new Translator();