type ActiveTab = {
    tabId: number,
    windowId: number
}
chrome.tabs.onActivated.addListener(activeInfo => move(activeInfo));

async function move(activeInfo: ActiveTab) {
    chrome.scripting.executeScript(
        {
            target: { tabId: activeInfo.tabId },
            files: ['tools.js']
        })
}