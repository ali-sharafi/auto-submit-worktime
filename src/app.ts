import { TranslateResult } from "./contract/TranslatorInterface";
import DictionaryService from "./services/DictionaryService";

class Translator {
    wordsList: Array<string>;

    constructor() {
        this.registerListener();
        this.wordsList = [];
    }

    registerListener(): void {
        document.addEventListener('mouseup', () => this.handleSelectedText());
    }

    async handleSelectedText(): Promise<void> {
        let selected = document.getSelection()?.toString().trim();
        if (selected && this.isSelectedValid(selected)) {
            this.wordsList.push(selected);
            console.log(process.env.ACTIVE_DICT, 'word: ', selected);
            this.createModal();
            let translation = await this.translateWord(selected);
            console.log('translation: ', translation);
        }
    }

    async translateWord(word: string): Promise<TranslateResult | null> {
        let dictionaryService = new DictionaryService();
        return await dictionaryService.readTranslate(word);
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