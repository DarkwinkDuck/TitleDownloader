const getArrayFromStorage = async (a) => {
    await chrome.storage.session.get("usedTabs").then((result) => { a = result.usedTabs });
    return a
}

const getArrayFromBG = async (a) => {
    await chrome.storage.session.get("actualTabs").then((result) => { a = result.actualTabs });
    return a
}
const setArrayInStorage = (tabs) => {
    chrome.storage.session.set({ usedTabs: tabs });
}

const getFileName = (url) => {
    if (url.includes("music.yandex")) return "Get_music_title_YM.js";
    else if (url.includes("vk.com")) return "Get_music_title_VK.js";
    else if (url.includes("youtube.com")) return "Get_music_title_YT.js";
    else return "";
};

const setInitialStorageState = async () =>
    Promise.all([
        chrome.storage.session.set({ outerStop: 0 }),
        chrome.storage.session.set({ innerStop: 0 }),
        chrome.storage.session.set({ antiDodikProtection: 1 }),
        chrome.storage.session.set({ usedTabs: [1, 2] }),
    ]);
const innerIntervalCD = 3000;

const outerScript = setInterval(async () => {
    console.log(1);
    await setInitialStorageState();
    let audibleTabList = [];
    await chrome.runtime.sendMessage(
        "Tabs?",
    );      
    let a;
    audibleTabList = await getArrayFromBG(a);
    console.log(audibleTabList);
    audibleTabList.forEach(async ({ url, id }) => {
        let a;
        const tabs = await getArrayFromStorage(a);
        console.log(tabs);
        const fileNameByUrl = getFileName(url);
        if (tabs.includes(id) || !fileNameByUrl) return;
        setArrayInStorage([...tabs, id]);

        setTimeout(() => {
            chrome.storage.session.set({ innerStop: 2 });
        }, 1);

        setTimeout(async () => {
            alert('pognali!' + '"' + `${fileNameByUrl}` + '"' + id);
            await chrome.scripting.executeScript({
                target: { tabId: id },
                files: ['Global(local)script.js'],
            });
            clearInterval(outerScript);
        }, innerIntervalCD);
    });

    const { outerStop } = await chrome.storage.session.get("outerStop");
    if (Number(outerStop) >= 1) clearInterval(outerScript);
}, 10000);




