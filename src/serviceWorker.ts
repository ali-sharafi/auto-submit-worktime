import { v4 as uuidv4 } from 'uuid';

declare type TranslationPayload = {
    word: string;
    meanings: string;
    category: string;
    sheetID: string;
    setID: string;
    definitionsID: string;
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.message === "store") {
            store(request.payload);
            sendResponse({ farewell: "gotit" });
        }
    }
);

function store(payload: TranslationPayload) {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        let appendRes = await append(payload, token);
        if (appendRes && appendRes.updates && appendRes.updates.updatedRows > 0) {
            sendUpdatedStatus('success');
        } else sendUpdatedStatus('error', appendRes);
    })
}

function sendUpdatedStatus(message: string, payload: object | null = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id as number, { type: 'updateRes', message, payload }, () => { });
    });
}

async function append(payload: TranslationPayload, token: string) {
    let init = {
        method: 'POST',
        async: true,
        body: JSON.stringify({
            range: 'L:O',
            majorDimension: "ROWS",
            values: [
                [
                    generateUID(),//vocabularyId
                    payload.definitionsID,//originalDefinitionIds
                    payload.word,//originalVocabularyText
                    "ACTIVE",//originalVocabularyStatus
                    payload.meanings,//originalDefinitions
                    payload.category,//originalCategory
                    0,//originalSpacedRepetitionLevel
                    0,//originalWritingLevel
                    false,//originalDisableWriting
                    payload.setID,//originalSetId
                    payload.word,//vocabularyText
                    "ACTIVE",//vocabularyStatus
                    payload.meanings,//definitions
                    payload.category,//category
                    0,//spacedRepetitionLevel
                    0,//writingLevel
                    false,//disableWriting
                    payload.setID,//setId
                    "NEW"//edited
                ]
            ]
        }),
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };
    let response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${payload.sheetID}/values/L:O:append?valueInputOption=USER_ENTERED`,
        init).catch(console.error)
    if (response)
        return await response.json();
}

function generateUID() {
    return uuidv4();
}