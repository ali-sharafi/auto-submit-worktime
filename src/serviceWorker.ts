
declare type TranslationPayload = {
    word: string;
    meanings: string;
    category: string;
    sheetID: string;
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
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        let init = {
            method: 'POST',
            async: true,
            body: JSON.stringify({
                range: 'K1:N1',
                values: [
                    [
                        payload.word,
                        null,
                        payload.meanings,
                        payload.category
                    ]
                ]
            }),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            'contentType': 'json'
        };
        fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${payload.sheetID}/values/K1:N1:append?valueInputOption=USER_ENTERED`,
            init)
            .then(async (response) => {
                console.log('response: ', await response.json());
            }).catch(console.error)
        console.log('paylod: ', payload, 'token: ', token);
    })
}