let runScript = document.getElementById("runScript");
let clearAll = document.getElementById("ClearFiles");
let stopScript = document.getElementById("stopScript");

const getArrayFromStorage = async (a) => {
  await chrome.storage.session.get("usedTabs").then((result) => { a = result.usedTabs });
  return a
}
const setArrayInStorage = (tabs) => {
  chrome.storage.session.set({ usedTabs: tabs });
}
const downloadTitle = (text, fileName) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/text;charset=utf-8," + encodeURI(text)
  );
  element.setAttribute("download", fileName);
  element.click();
  delete element;
};

const getMusicEmpty = () => {
  chrome.storage.session.set({ titleCurrent: "" });
  downloadTitle("", "HeaderCurrent.txt");
  downloadTitle("", "TrackCurrent.txt");
};

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
  ]);
const innerIntervalCD = 3000;

const runScriptHandler = async () => {
  const { antiDodikProtection } = await chrome.storage.session.get(
    "antiDodikProtection"
  );
  if (antiDodikProtection) return;

  await setInitialStorageState();
  const outerScript = async () => {
    const audibleTabList = [];
    audibleTabList.push(...(await chrome.tabs.query({ audible: true })));
    audibleTabList.forEach(async ({ url, id }) => {
      let a;
      const tabs = await getArrayFromStorage(a);
      const fileNameByUrl = getFileName(url);
      if (tabs.includes(id) || !fileNameByUrl) return;
      if (!tabs) {
        const usedTabsId = [];
        usedTabsId.push(id);
        setArrayInStorage(usedTabsId);
      } else {
        tabs.push(id)
        setArrayInStorage(tabs);
      }
      chrome.storage.session.set({ antiDodikProtection: 1 });
      setTimeout(() => {
        chrome.storage.session.set({ innerStop: 2 });
        chrome.storage.session.set({ outerStop: 2 });
      }, 1);

      setTimeout(() => {
        alert('pognali!' + '"' + `${fileNameByUrl}` + '"' + id);
        chrome.scripting.executeScript({
          target: { tabId: id },
          files: ['Global(local)script.js'],
        });
      }, innerIntervalCD);
    });
  }
  outerScript();
};

const stopScriptHandler = () => {
  Promise.all([
    chrome.storage.session.set({ innerStop: 2 }),
    chrome.storage.session.set({ outerStop: 2 }),
  ]);
  setTimeout(() => {
    chrome.storage.session.clear();
  }, innerIntervalCD);
};

runScript.addEventListener("click", runScriptHandler);
clearAll.addEventListener("click", getMusicEmpty);
stopScript.addEventListener("click", stopScriptHandler);
