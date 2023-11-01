// let scrapeEmails = document.getElementById('scrapeEmails');

// let list = document.getElementById('emailList');
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     let emails = request.emails;
//     // alert(emails);

//     if (emails == null || emails.length == 0) {
//         let li = document.createElement('li');
//         li.innerText = "No Email Found On This Page";
//         list.appendChild(li);
//     }
//     else {
//         emails.forEach((emails) => {
//             let li = document.createElement('li');
//             li.innerText = emails;
//             list.appendChild(li);
//         });
//     }
// })

// scrapeEmails.addEventListener("click", async () => {
//     // alert('hello');
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: scrapeEmailAndName,
//     });
// })

// function scrapeEmailAndName() {
//     const emailRegEx = /0\d{10}/gim;

//     let emails = document.body.innerHTML.match(emailRegEx);
//     // alert(emails);

//     chrome.runtime.sendMessage({ emails });
// }
