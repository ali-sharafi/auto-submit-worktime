const StorageService = class {
    sheetID: string;

    constructor() {
        this.sheetID = process.env.SHEET_ID!;
    }

    store(word: string, meanings: Array<string>): void {
        let stringifyMeanings = '';
        if (meanings.length > 1)
            stringifyMeanings = this.parseMeanings(meanings);
        else stringifyMeanings = meanings[0].replace(/<[^>]*>/g, "");

        this.sendToServiceWorker(word, stringifyMeanings, 'LVL6');
    }

    sendToServiceWorker(word: string, meanings: string, category: string) {
        chrome.runtime.sendMessage({ message: "store", payload: { word, meanings, category, sheetID: this.sheetID } }, () => { });
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