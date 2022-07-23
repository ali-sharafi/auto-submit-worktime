import { v4 as uuidv4 } from 'uuid';

const StorageService = class {
    sheetID: string;

    constructor() {
        this.sheetID = process.env.SHEET_ID!;
    }

    async store(word: string, meanings: Array<string>): Promise<void> {
        const now = this.now();
        let parsedMeanings = this.parseMeanings(meanings, now);
        let definitionsID = this.generateDefinitionID(meanings.length);
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
            this.sendToServiceWorker(word, parsedMeanings, definitionsID, 'Lingemy', now, currentUser.setID, currentUser.accessToken);
        } else this.sendUpdatedStatus('error', { error: "Pls login first" })
    }

    async getCurrentUser() {
        let currentUser = await chrome.storage.local.get(process.env.LOCAL_STORAGE_KEY);
        if (currentUser.hasOwnProperty(process.env.LOCAL_STORAGE_KEY!)) {
            return JSON.parse(currentUser[process.env.LOCAL_STORAGE_KEY!]);
        }
        return null;
    }

    sendToServiceWorker(word: string, meanings: Array<object>, definitionsID: string, category: string, now: string, setID: string, userToken: string) {
        chrome.runtime.sendMessage({
            message: "store", payload: {
                word,
                meanings,
                category,
                now,
                setID,
                userToken,
                sheetID: this.sheetID,
                definitionsID
            }
        }, () => { });
    }

    sendUpdatedStatus(message: string, payload: object | null = null) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { type: 'updateRes', message, payload }, () => { });
        });
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

    parseMeanings(meanings: Array<string>, now: string) {
        let result = [];
        for (let i = 0; i < meanings.length; i++) {
            const element = meanings[i];
            const meaning = element.replace(/<[^>]*>/g, "");

            result.push({
                "definitionId": this.generateUID(),
                "definitionStatus": "ACTIVE",
                "meaning": meaning,
                "wordClasses": [],
                "source": "N/A",
                "createdAt": now,
                "updatedAt": now,
                "updatedStatusAt": now,
                "firstSyncedAt": null,
                "lastSyncedAt": null,
                "extraData": []
            });
        }
        return result;
    }

    now() {
        let date = new Date();
        return date.toISOString();
    }
}

export default new StorageService();