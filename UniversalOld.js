  const keywords = ['music.yandex', 'vk.com', 'youtube.com'];
  let usedTabsLocal = [1, 2];
  function downloadTitle(text, fileName) { // Скачивание файла
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text));
        element.setAttribute('download', fileName);
        element.click();
        delete element;
  };

  chrome.storage.local.set({ zalupa: 10 });
  chrome.storage.local.get(["zalupa"]).then( (result) => {
    (a = result.zalupa);
    alert(a + 'lol');
  });
  setTimeout(() => { alert(a + 'kek')}, 1);

  chrome.storage.local.set({ zalupa: 10 });
  chrome.storage.local.get(["zalupa"]).then( (result) => {
    (a = result.zalupa);
    alert(a + 'lol');
  });
  alert(a + 'kek');
 
  localStorage.setItem('antiDodikProtection', 0);

  function getMusicEmpty() { // Скачивание при запуске (без воспроизведения)
    let letpar = {
      titleFirstCurrent: '', // Название текущего трека при запуске (без воспроизведения)
      HeaderCurrent: 'HeaderCurrent.txt', // Название файла с плашкой текущего трека
      TrackCurrent: 'TrackCurrent.txt', // Название файла с текущим треком
      txtFirstCurrent: '', // Плашка текущего трека при запуске (без воспроизведения)
    };
    localStorage.setItem('titleCurrent', "");
    alert(localStorage.getItem('titleCurrent'));
    downloadTitle(letpar.txtFirstCurrent, letpar.HeaderCurrent);
    downloadTitle(letpar.titleFirstCurrent, letpar.TrackCurrent);
  };
  
  function returnArray() {
    usedTabsLocal = JSON.parse(localStorage.getItem('usedTabs'));
  };

  function cacheArray() {
    localStorage.setItem('usedTabs', JSON.stringify(usedTabsLocal));
  };

  let runScript = document.getElementById("runScript");     
  let clearAll = document.getElementById("ClearFiles"); 
  let stopScript = document.getElementById("stopScript");
             
  runScript.addEventListener("click", () => {

      alert(1);
    if (localStorage.getItem("antiDodikProtection") == 0) {
      alert(2);
      cacheArray();
      localStorage.setItem('outerStop', 0);
      localStorage.setItem('innerStop', 0);
      localStorage.setItem('innerIntervalCD', 3000);
      localStorage.setItem('outerIntervalCD', 3000);
      localStorage.setItem('antiDodikProtection', 1);
      let outerScript = setInterval( async () => {
        let kek = [];
        kek.push(...(await (chrome.tabs.query({audible: true}))));
        returnArray();
        kek.forEach( (key) => {
          if (!usedTabsLocal.includes(key.id)) {
            alert(4);
            if (key.url.includes(keywords[0])) {
              usedTabsLocal.push(key.id);
              cacheArray();
              localStorage.setItem('innerStop', 2);
              setTimeout(() => {              
                chrome.scripting.executeScript({
                target: { tabId: key.id }, 
                files: ["Get_music_title_YM.js"]
                });
              }, +localStorage.getItem("innerIntervalCD"));
            } else if (key.url.includes(keywords[1])){
              alert(5);
              usedTabsLocal.push(key.id);
              cacheArray();
              localStorage.setItem('innerStop', 2);
              setTimeout(() => {              
                chrome.scripting.executeScript({
                target: { tabId: key.id }, 
                files: ["Get_music_title_VK.js"]
                });
              }, +localStorage.getItem("innerIntervalCD"));
            } else if (key.url.includes(keywords[2])) {
              usedTabsLocal.push(key.id);
              cacheArray();
              localStorage.setItem('innerStop', 2);
              setTimeout(() => {              
                chrome.scripting.executeScript({
                target: { tabId: key.id }, 
                files: ["Get_music_title_YT.js"]
                });
              }, +localStorage.getItem("innerIntervalCD"));
            };
          };
        }); 
        if (+localStorage.getItem(["outerStop"]) >= 1) {
          clearInterval(outerScript);
        };
      }, +localStorage.getItem("outerIntervalCD"));
    };
  });    
  
  clearAll.addEventListener("click", () => {
  getMusicEmpty();
  });

  stopScript.addEventListener('click', () => {
  localStorage.setItem('innerStop', 2);
  localStorage.setItem('outerStop', 2);
  setTimeout(() => {
    chrome.storage.local.clear();
    localStorage.setItem('antiDodikProtection', 0);
  }, 1500);
  });
