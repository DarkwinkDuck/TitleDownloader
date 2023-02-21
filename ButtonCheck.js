  let letpar = {
    titleFirstCurrent: '', // Название текущего трека при запуске (без воспроизведения)
    txtFirstCurrent: '', // Плашка текущего трека при запуске (без воспроизведения)
    HeaderCurrent: 'HeaderCurrent.txt', // Название файла с плашкой текущего трека
    TrackCurrent: 'TrackCurrent.txt', // Название файла с текущим треком
    keywords: ['vk.com', 'music.yandex', 'youtube.com'],
    playBtnCurrent: '',
    playBtnNext: '',
  };
   
  function downloadTitle(text, fileName) { // Скачивание файла
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text));
        element.setAttribute('download', fileName);
        element.click();
        delete element;
  };
    
  function getMusicEmpty() { // Скачивание при запуске (без воспроизведения)
        downloadTitle(letpar.txtFirstCurrent, letpar.HeaderCurrent);
        downloadTitle(letpar.titleFirstCurrent, letpar.TrackCurrent);
  };


  function UnificeBotton() {
    switch(letpar.playBtnCurrent) {
      case 'Приостановить': letpar.playBtnCurrent = 'Play'
      break;
      case 'Воспроизвести': letpar.playBtnCurrent = 'Pause'
      break;
      case 'Pause': letpar.playBtnCurrent = 'Play'
      break;
      case 'Play': letpar.playBtnCurrent = 'Pause'
      break;
      case 'Играть [P]': letpar.playBtnCurrent = 'Pause'
      break;
      case 'Пауза [P]': letpar.playBtnCurrent = 'Play'
      break;
      case 'Play [P]': letpar.playBtnCurrent = 'Pause'
      break;
      case 'Pause [P]': letpar.playBtnCurrent = 'Play'
      break;
      case 'Pause (k)': letpar.playBtnCurrent = 'Play'
      break;
      case 'Play (k)': letpar.playBtnCurrent = 'Pause'
      break;
      case 'Пауза (k)': letpar.playBtnCurrent = 'Play'
      break;
      case 'Смотреть (k)': letpar.playBtnCurrent = 'Pause';
    }
    switch(letpar.playBtnNext) {
      case 'Приостановить': letpar.playBtnNext = 'Play'
      break;
      case 'Воспроизвести': letpar.playBtnNext = 'Pause'
      break;
      case 'Pause': letpar.playBtnNext = 'Play'
      break;
      case 'Play': letpar.playBtnNext = 'Pause'
      break;  
      case 'Играть [P]': letpar.playBtnNext = 'Pause'
      break;
      case 'Пауза [P]': letpar.playBtnNext = 'Play'
      break;
      case 'Play [P]': letpar.playBtnNext = 'Pause'
      break;
      case 'Pause [P]': letpar.playBtnNext = 'Play'
      break;
      case 'Пауза (k)': letpar.playBtnNext = 'Play'
      break;
      case 'Смотреть (k)': letpar.playBtnNext = 'Pause'
      break;
      case 'Pause (k)': letpar.playBtnNext = 'Play'
      break;
      case 'Play (k)': letpar.playBtnNext = 'Pause';
      }
  };

  async function ButtonValue() {
    alert(1);
    let kek = [];
    kek.push(...(await chrome.tabs.query({})));
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes(letpar.keywords[0])) {
        letpar.playBtnNext = document.querySelector('._top_audio_player_play').innerText;
        UnificeBotton();
        if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
            kek.forEach( (key) => {
                chrome.scripting.executeScript({
                  target: { tabId: key.id },
                  files: ["StopFunc.js"],
                })});
            setTimeout( () => {
                chrome.scripting.executeScript({
                  target: { tabId: tab.id }, 
                  files: ["Get_music_title_VK.js"]
                });
            }, 1000);
        };
        letpar.playBtnCurrent = letpar.playBtnNext;
      } else if (tab.url.includes(letpar.keywords[1])) {
        letpar.playBtnNext = document.querySelector('.player-controls__btn_play').title;
        UnificeBotton();
        if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
            kek.forEach( (key) => {
                chrome.scripting.executeScript({
                  target: { tabId: key.id },
                  files: ["StopFunc.js"],
                })});
            setTimeout( () => {
                chrome.scripting.executeScript({
                  target: { tabId: tab.id }, 
                  files: ["Get_music_title_YM.js"]
                });
            }, 1000);
        };
        letpar.playBtnCurrent = letpar.playBtnNext;
      } else if (tab.url.includes(letpar.keywords[2])) {
        letpar.playBtnNext = document.querySelector('.ytp-play-button.ytp-button').title;
        UnificeBotton();
        if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
            kek.forEach( (key) => {
                chrome.scripting.executeScript({
                  target: { tabId: key.id },
                  files: ["StopFunc.js"],
                })});
            setTimeout( () => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id }, 
                    files: ["Get_music_title_YM.js"]
                });
            }, 1000);
        };
        letpar.playBtnCurrent = letpar.playBtnNext;
      } else {
        alert('Ты че накодил, мудила?');
      };
      alert(2);
  };

  function ButtonCheck() {
    setInterval(async function ButtonValue() {
      alert(1);
      let kek = [];
      kek.push(...(await chrome.tabs.query({})));
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url.includes(letpar.keywords[0])) {
          letpar.playBtnNext = document.querySelector('._top_audio_player_play').innerText;
          UnificeBotton();
          if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
              kek.forEach( (key) => {
                  chrome.scripting.executeScript({
                    target: { tabId: key.id },
                    files: ["StopFunc.js"],
                  })});
              setTimeout( () => {
                  chrome.scripting.executeScript({
                      target: { tabId: tab.id }, 
                      files: ["Get_music_title_VK.js"]
                  });
              }, 1000);
          };
          letpar.playBtnCurrent = letpar.playBtnNext;
        } else if (tab.url.includes(letpar.keywords[1])) {
          letpar.playBtnNext = document.querySelector('.player-controls__btn_play').title;
          UnificeBotton();
          if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
              kek.forEach( (key) => {
                  chrome.scripting.executeScript({
                    target: { tabId: key.id },
                    files: ["StopFunc.js"],
                  })});
              setTimeout( () => {
                  chrome.scripting.executeScript({
                      target: { tabId: tab.id }, 
                      files: ["Get_music_title_YM.js"]
                  });
              }, 1000);
          };
          letpar.playBtnCurrent = letpar.playBtnNext;
        } else if (tab.url.includes(letpar.keywords[2])) {
          letpar.playBtnNext = document.querySelector('.ytp-play-button.ytp-button').title;
          UnificeBotton();
          if ((letpar.playBtnNext === 'Play')&&(letpar.playBtnNext !== letpar.playBtnCurrent)) {
              kek.forEach( (key) => {
                  chrome.scripting.executeScript({
                    target: { tabId: key.id },
                    files: ["StopFunc.js"],
                  })});
              setTimeout( () => {
                  chrome.scripting.executeScript({
                      target: { tabId: tab.id }, 
                      files: ["Get_music_title_YM.js"]
                  });
              }, 1000);
          };
          letpar.playBtnCurrent = letpar.playBtnNext;
        } else {
          alert('Ты че накодил, мудила?');
        };
        alert(2);
    }, 3000);
  };

  //let runScript = document.;
  //console.log(runScript);

  //[object HTMLButtonElement]
  alert(0);
  //document.addEventListener("DOMContentLoaded",  );

  /*async function () {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes(letpar.keywords[0])) {
        
      } else if (tab.url.includes(letpar.keywords[1])) {
        
      } else if (tab.url.includes(letpar.keywords[2])) {
        
      } else {
        alert('Ты че накодил, мудила?');
      }
  };*/

  
  /*let runScript = document.getElementById("runScript");     
  let clearAll = document.getElementById("ClearFiles"); 
             
  runScript.addEventListener("click", async () => {
    let kek = [];
    kek.push(...(await chrome.tabs.query({})));
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    setTimeout( () => {
      if (tab.url.includes(letpar.keywords[0])) {
      kek.forEach( (key) => {
        chrome.scripting.executeScript({
          target: { tabId: key.id },
          files: ["StopFunc.js"],
        })});
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, 
        files: ["Get_music_title_VK.js"]
      });
    } else if (tab.url.includes(letpar.keywords[1])) {
      kek.forEach( (key) => {
        chrome.scripting.executeScript({
          target: { tabId: key.id },
          files: ["StopFunc.js"],
        })});
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, 
        files: ["Get_music_title_YM.js"]
      });
    } else if (tab.url.includes(letpar.keywords[2])) {
      kek.forEach( (key) => {
        chrome.scripting.executeScript({
          target: { tabId: key.id },
          files: ["StopFunc.js"],
        })});
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, 
        files: ["Get_music_title_YT.js"]
      });
    } else {
      alert('Ты че накодил, мудила?');
    }
  }, 1000)
  });    
  
  clearAll.addEventListener("click", async () => {
      getMusicEmpty();
  });*/
  $('.switch-btn').on('on.switch', function(){
    console.log('Кнопка переключена в состояние on');
  });
  $('.switch-btn').on('off.switch', function(){
    console.log('Кнопка переключена в состояние off');
  });