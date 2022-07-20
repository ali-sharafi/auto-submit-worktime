import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const StorageService = class {
    sheetID: string;

    constructor() {
        this.sheetID = process.env.SHEET_ID!;
    }

    store(word: string, meanings: Array<string>): void {
        const now = this.now();
        let parsedMeanings = this.parseMeanings(meanings, now);
        let definitionsID = this.generateDefinitionID(meanings.length);
        const currentUser = localStorage.getItem(process.env.LOCAL_STORAGE_KEY!);
        if (currentUser) {
            let parsedUser = JSON.parse(currentUser);
            this.storeToUlangi(word, parsedMeanings, definitionsID, 'Lingemy', now, parsedUser.setID)
        } else this.sendUpdatedStatus('error', { error: "Pls login first" })

        // this.sendToServiceWorker(word, stringifyMeanings, definitionsID, 'LVL6');
    }

    storeToUlangi(word: string, meanings: Array<object>, definitionsID: string, category: string, now: string, setID: string) {
        axios.post(process.env.ULANGI_SERVER + "/upload-vocabulary", {
            "vocabularyList": [
                {
                    "vocabularyId": definitionsID,
                    "vocabularyStatus": "ACTIVE",
                    "vocabularyText": word,
                    "definitions": meanings,
                    "category": {
                        "categoryName": category,
                        "createdAt": now,
                        "updatedAt": now,
                        "firstSyncedAt": null,
                        "lastSyncedAt": null
                    },
                    "lastLearnedAt": null,
                    "level": 0,
                    "createdAt": now,
                    "updatedAt": now,
                    "updatedStatusAt": now,
                    "firstSyncedAt": null,
                    "lastSyncedAt": null,
                    "extraData": []
                }],
            "vocabularySetIdPairs": [[definitionsID, setID]]
        }).then(res => {
            if (res.data && res.data.acknowledged) {
                this.sendUpdatedStatus('success')
            } else this.sendUpdatedStatus('error', res.data)
        }).catch(err => {
            this.sendUpdatedStatus('error', err.response.data)
        })
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