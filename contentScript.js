document.addEventListener("DOMContentLoaded", function () {
    let scrapeData = document.getElementById("scrapeData");
    let list = document.getElementById("dataList");

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        let data = request.data;

        if (data == null || data.length === 0) {
            let li = document.createElement("li");
            li.innerText = "No Data Found On This Page";
            list.appendChild(li);
        } else {
            for (const val of data) {
                for (const key in val) {
                    let li = document.createElement("li");
                    li.innerText = val[key];
                    list.appendChild(li);
                }
            }
        }
        const rows = data;
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Justdial Data");

        XLSX.utils.sheet_add_aoa(worksheet, [["Title", "Phone Number"]], {
            origin: "A1",
        });

        const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
        worksheet["!cols"] = [{ wch: max_width }, { wch: 20 }];

        XLSX.writeFileXLSX(workbook, "justdial_data.xlsx");
    });

    scrapeData.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapeDataFromPage,
        });
    });

    function scrapeDataFromPage() {
        const titleElements = document.querySelectorAll("h2");
        const phoneRegEx = /0\d{10}/gim;
        // /(\+\d{1,2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s?\d{3}[-\s]?\d{4}|\d{10})/g;

        let titles = Array.from(titleElements, (element) => element.innerText);
        let phoneMatches = document.body.innerText.match(phoneRegEx);

        let data = [];

        if (titles && phoneMatches) {
            for (let i = 0; i < titles.length && i < phoneMatches.length; i++) {
                const obj = new Object();
                obj.name = titles[i];
                obj.phone = phoneMatches[i];
                data.push(obj);
            }
        }

        chrome.runtime.sendMessage({ data });
    }
});
