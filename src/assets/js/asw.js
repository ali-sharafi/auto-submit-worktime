doASW.apply(this, arguments);

function waitForElement(selector, timeout) {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                resolve(element);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(intervalId);
            reject(new Error(`Timed out after ${timeout}ms waiting for element with selector '${selector}'`));
        }, timeout);
    });
}
function doASW(username, pass) {
    const that = self;
    //wait for 'submit mission' button
    that.waitForElement('#sg-ref-ref0-idun4', 1000 * 10).then(() => {
        that.submitWorktime();
    }).catch(async () => {
        that.login(username, pass);
        await that.waitForElement('#sg-ref-ref0-idun4', 1000 * 60);//wait for 'submit mission' button
        that.submitWorktime();
    })

    // // Close the tab
    // chrome.tabs.remove(tab.id);
}

async function submitWorktime() {
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