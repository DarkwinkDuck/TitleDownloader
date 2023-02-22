const getArrayFromStorage = async (a) => {
    await chrome.storage.local.get("usedTabs").then((result) => { a = result.usedTabs });
    return a
}

const getArrayFromBG = async (a) => {
    await chrome.storage.local.get("actualTabs").then((result) => { a = result.actualTabs });
    return a
}
const setArrayInStorage = (tabs) => {
    chrome.storage.local.set({ usedTabs: tabs });
}

const getFileName = (url) => {
    if (url.includes("vk.com")) return "Get_music_title_VK.js";
    else if (url.includes("music.yandex")) return "Get_music_title_YM.js";
    else if (url.includes("youtube.com")) return "Get_music_title_YT.js";
    else return "";
};

const setInitialStorageState = async () =>
    Promise.all([
        chrome.storage.local.set({ outerStop: 0 }),
        chrome.storage.local.set({ innerStop: 0 }),
    ]);

const innerIntervalCD = 1000;

setInitialStorageState();

const outerScript = setInterval(async () => {

    console.log(1);

    let audibleTabList = [];

    const port = await chrome.runtime.connect({});
    await port.postMessage('Tabs');
    await port.onMessage.addListener(async function (message, sender) {
        console.log(message);
    });
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
            chrome.storage.local.set({ innerStop: 2 });
        }, 1);

        setTimeout(async () => {
            await port.postMessage({ExecutedFile: fileNameByUrl, TabID: id});
            await port.onMessage.addListener(async function (message, sender) {
                console.log(message);
            });
            clearInterval(outerScript);
            console.log('zalupa1!');
        }, innerIntervalCD);
    });

    const { outerStop } = await chrome.storage.local.get("outerStop");

    if (Number(outerStop) >= 1) {
        console.log('zalupa2!');
        clearInterval(outerScript);
    }
}, innerIntervalCD);



