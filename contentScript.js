let scrapeData = document.getElementById('scrapeData');
let list = document.getElementById('dataList');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let data = request.data;

    if (data == null || data.length === 0) {
        let li = document.createElement('li');
        li.innerText = "No Data Found On This Page";
        list.appendChild(li);
    } else {
        data.forEach((item) => {
            let li = document.createElement('li');
            li.innerText = item;
            list.appendChild(li);
        });
    }
});

scrapeData.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeDataFromPage,
    });
});

function scrapeDataFromPage() {
    const titleElements = document.querySelectorAll('h2');
    const phoneRegEx = /0\d{10}/gim;
    // /(\+\d{1,2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s?\d{3}[-\s]?\d{4}|\d{10})/g;
    
    let titles = Array.from(titleElements, element => element.innerText);
    let phoneMatches = document.body.innerText.match(phoneRegEx);

    let data = [];

    if (titles && phoneMatches) {
        for (let i = 0; i < titles.length && i < phoneMatches.length; i++) {
            data.push(titles[i]);
            data.push(phoneMatches[i]);
        }
    }

    chrome.runtime.sendMessage({ data });
}