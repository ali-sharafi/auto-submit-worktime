// import { v4 as uuidv4 } from 'uuid';


const alarmName = 'daily-reminder';
const iconUrl = chrome.runtime.getURL('/icons/icon128.png');
var domainTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'popup-to-sw') {
        console.log(`Received message from popup: ${message.data}`);
        sendResponse('Hello from service worker!');
        asw()
    } else if (message.type === 'closeTab') {
        chrome.tabs.remove(sender.tab.id);
    }
});


chrome.alarms.create(alarmName, {
    when: getAlarmTime(18, 30), // Set the alarm for 18:30 PM
    periodInMinutes: 1440 // Set the alarm to repeat every 24 hours
});

// Add a listener for the alarm to trigger the notification
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === alarmName) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: iconUrl,
            title: 'ASW Reminder',
            message: 'Did you submit your today worktime?',
            requireInteraction: true,
            buttons: [
                { title: 'Dismiss' },
                { title: 'Submit by ASW!' }
            ]
        });
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIdx) => {
    if (buttonIdx == 0) {
        chrome.notifications.clear(notificationId);
    } else if (buttonIdx == 1) {
        asw();
    }
})

function registerNavigationListener() {
    chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
        // Check if the event is for the correct tab and URL pattern
        if (details.tabId === domainTabId) {
            if (details.url.match(/MissionDocumentEdit$/gm)) {
                chrome.scripting.executeScript({
                    target: { tabId: domainTabId },
                    func: sendWorktime
                });
            } else if (details.tabId === domainTabId && isMainPage(details.url)) {
                chrome.scripting.executeScript({
                    target: { tabId: domainTabId },
                    func: gotoWorktimePage
                });
            }
        }

    }, {
        tabId: domainTabId,
        url: [{ urlMatches: `${process.env.DOMAIN_HOST}/*` }]
    });
}

function isMainPage(url) {
    let matched = url.match(new RegExp(process.env.DOMAIN_HOST_REGEX, 'gm'))
    return matched && matched.length > 0
}

// Helper function to calculate the timestamp for a given hour and minute
function getAlarmTime(hour, minute) {
    const alarmTime = new Date();
    alarmTime.setHours(hour);
    alarmTime.setMinutes(minute);
    alarmTime.setSeconds(0);
    alarmTime.setMilliseconds(0);
    if (alarmTime < new Date()) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }
    return alarmTime.getTime();
}

async function asw() {
    let userInfo = await chrome.storage.local.get(process.env.LOCAL_STORAGE_KEY);
    let [username, pass] = Buffer.from(userInfo[process.env.LOCAL_STORAGE_KEY], 'base64').toString().split(':');
    if (userInfo.hasOwnProperty(process.env.LOCAL_STORAGE_KEY)) {
        chrome.tabs.create({ url: process.env.DOMAIN_URL, active: false }, async (tab) => {
            domainTabId = tab.id;
            registerNavigationListener();
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: login,
                args: [username, pass]
            })
        });
    } else {
        notifyUser('Could not find a valid username and password, you need to first login by click on extension icon!');
    }
}

function sendWorktime() {
    setTimeout(() => {
        //Click on mission type arrow
        document.querySelectorAll('a.textbox-icon.combo-arrow')[1].click();
        //Click on the first row of opened table for mission type
        document.querySelectorAll('#datagrid-row-r2-2-0')[0].click();
        let startTimeInput = document.querySelectorAll('input[name^=sg-MissionDocumentEdit][type=hidden].textbox-value')[9];
        let endTimeInput = document.querySelectorAll('input[name^=sg-MissionDocumentEdit][type=hidden].textbox-value')[11];
        let saveBtn = document.querySelectorAll('.operationButton')[1];
        startTimeInput.value = '09:00';
        endTimeInput.value = '18:00';

        //Click on plus in start time to interact with page, needs to update the start time value
        document.querySelectorAll('.textbox-button.spinner-button')[0].click();
        //Click on plus in end time to interact with page, needs to update the end time value
        document.querySelectorAll('.textbox-button.spinner-button')[2].click();
        //Click on empty part of page to set all values, it's weird but needs!
        document.querySelector('.operationButton.l-btn-disabled').click();
        setTimeout(() => {
            saveBtn.click();
        }, 1000 * 1);
    }, 1000 * 7);

    setTimeout(() => {
        if (document.querySelector('img[src="Large-Saved.png"]')) {
            chrome.runtime.sendMessage({ type: "closeTab" });
        }
    }, 1000 * 5);
}

function gotoWorktimePage() {
    const missionBtn = document.getElementById('sg-ref-ref0-idun4');
    missionBtn.click();
}

function login(username, pass) {
    const userNameInput = document.getElementById('UserName');
    userNameInput.value = username;
    const passwordInput = document.getElementById('Password');
    passwordInput.value = pass;
    const loginBtn = document.getElementById('Login');
    loginBtn.click();
}

function notifyUser(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: iconUrl,
        title: 'ASW',
        message: message,
        requireInteraction: true,
        buttons: [
            { title: 'Dismiss' }
        ]
    });
}