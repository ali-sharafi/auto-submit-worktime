import { v4 as uuidv4 } from 'uuid';

const StorageService = class {
    sheetID: string;

    constructor() {
        this.sheetID = process.env.SHEET_ID!;
    }

    store(word: string, meanings: Array<string>): void {
        let stringifyMeanings = '';
        let definitionsID = '';
        if (meanings.length > 1) {
            stringifyMeanings = this.parseMeanings(meanings);
            definitionsID = this.generateDefinitionID(meanings.length);
        }
        else {
            stringifyMeanings = meanings[0].replace(/<[^>]*>/g, "");
            definitionsID = this.generateUID();
        }

        this.sendToServiceWorker(word, stringifyMeanings, definitionsID, 'LVL6');
    }

    sendToServiceWorker(word: string, meanings: string, definitionsID: string, category: string) {
        chrome.runtime.sendMessage({
            message: "store", payload: {
                word,
                meanings,
                category,
                sheetID: this.sheetID,
                setID: process.env.SET_ID,
                definitionsID
            }
        }, () => { });
    }

    generateDefinitionID(count: number) {
        let ids = '';
        for (let i = 0; i < count; i++) {
            ids += this.generateUID();
            if (count + 1 < count) ids += "\n" + '---' + "\n";
        }
        return ids;
    }

    generateUID() {
        return uuidv4();
    }

    parseMeanings(meanings: Array<string>) {
        let result = '';
        for (let i = 0; i < meanings.length; i++) {
            const element = meanings[i];
            result += element.replace(/<[^>]*>/g, "");
            if (meanings[i + 1]) result += "\n" + '---' + "\n";
        }
        return result;
    }
}

export default new StorageService();