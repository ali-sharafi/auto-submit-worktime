// import DictionaryService from "./services/DictionaryService";

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
            console.log(process.env.ACTIVE_DICT, 'word: ', selected);
            this.createModal();
            this.translateWord(selected);
        }
    }

    async translateWord(word: string) {
        // let dictionaryService = new DictionaryService();
        // dictionaryService.readTranslate(word);
    }

    createModal() {
        if (document.querySelector('.translator-wraper')) return;

        let divWraper = document.createElement('div');
        divWraper.id = 'main-wraper';
        divWraper.className = 'translator-wraper';
        document.body.append(divWraper);
    }

    isSelectedValid(selected: string): boolean {
        return !!(isNaN(Number(selected)) && this.wordsList.indexOf(selected) === -1)
    }
}

export default new Translator();