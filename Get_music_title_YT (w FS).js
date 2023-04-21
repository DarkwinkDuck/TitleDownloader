let LocalPars = {
  titleNext: '',
  subtitle: '',
  subtitleOld: '',
  playBtnCurrent: '',
  playBtnNext: '',
  stopTimer: 0,
  HeaderCurrent: 'HeaderCurrent.txt', // Название файла с плашкой
  TrackCurrent: 'TrackCurrent.txt', // Название файла с текущим треком
  txtCurrentPlay: 'Текущий трек: ', // Плашка при воспроизведении
  txtPauseCurrent: 'Последний трек: ', // Плашка при паузе
  txtStopCurrent: '', // Плашка при длительной паузе
  titleStopCurrent: '', // Название трека при длительной паузе
  txtFullScreen: '',
  titleFullScreen: '',
  stop: 10, // Время паузы, после которой всё обнуляется (в секундах)
  fullScreenBtnNext: '',
  fullScreenBtnCurrent: '',
}
setTimeout(() => chrome.storage.local.set({ innerStop: 0 }), 1);
chrome.storage.local.set({ titleCurrent: "" });

function UnificeBotton() { // Приведение значения кнопок к универсальному
  switch (LocalPars.playBtnNext) { // Кнопки воспроизведения
    case 'Пауза (k)': LocalPars.playBtnNext = 'Play'
      break;
    case 'Смотреть (k)': LocalPars.playBtnNext = 'Pause'
      break;
    case 'Pause (k)': LocalPars.playBtnNext = 'Play'
      break;
    case 'Play (k)': LocalPars.playBtnNext = 'Pause';
  }
  switch (LocalPars.fullScreenBtnNext) { // Кнопки полноэкранного режима
    case 'Во весь экран (f)': LocalPars.fullScreenBtnNext = 'SmallScreen'
      break;
    case 'Выход из полноэкранного режима (f)': LocalPars.fullScreenBtnNext = 'FullScreen'
      break;
    case 'Full screen (f)': LocalPars.fullScreenBtnNext = 'SmallScreen'
      break;
    case 'Exit full screen (f)': LocalPars.fullScreenBtnNext = 'FullScreen';
  }
};

function downloadTitle(text, fileName) { // Скачивание файла
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text + "   "));
  element.setAttribute('download', fileName);
  element.click();
  delete element;
};

function mainPageFixYT() { // Проверка на главную страницу
  return (LocalPars.titleNext[1] === ' ') 
};

function fullScreenFix() { // Проверка на полноэкранный режим
  LocalPars.fullScreenBtnNext = document.querySelector('.ytp-fullscreen-button.ytp-button').title;
  UnificeBotton();
  return (LocalPars.fullScreenBtnNext === 'FullScreen') 
};

function getPlayBtnYT() { // Получение доступа к кнопке воспроизведения
  let playBtn = document.querySelector('.ytp-play-button.ytp-button');
  return playBtn
};

function writingTitleYT() { // Перезапись названия
  let title = document.querySelector('h1.style-scope.ytd-watch-metadata').innerText;
  return title
};

async function getMusicTitleYT() { // Скачивание последующее
  let { titleCurrent } = await chrome.storage.local.get('titleCurrent');
  if (fullScreenFix()) {
    if (LocalPars.fullScreenBtnNext !== LocalPars.fullScreenBtnCurrent) { // Исправление работы при полноэкранном режиме
      await chrome.storage.local.set({ titleCurrent: LocalPars.titleFullScreen });
      titleCurrent = LocalPars.titleFullScreen;
      downloadTitle(LocalPars.txtFullScreen, LocalPars.HeaderCurrent);
      downloadTitle(titleCurrent, LocalPars.TrackCurrent);
    }
  } else {
    LocalPars.playBtnNext = getPlayBtnYT().title;
    UnificeBotton();
    LocalPars.titleNext = writingTitleYT();
    if (LocalPars.playBtnNext === 'Play') {
      if (!mainPageFixYT()) { // Для страницы воспроизведения
        if (LocalPars.titleNext !== titleCurrent) { // При переключении трека и нажатии на кнопку воспроизведения
          downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
          downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
          await chrome.storage.local.set({ titleCurrent: LocalPars.titleNext });
        };
        LocalPars.playBtnCurrent = LocalPars.playBtnNext;
      }
    } else // Для всех страниц
      if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку паузы
        if (LocalPars.fullScreenBtnNext !== LocalPars.fullScreenBtnCurrent) { // При выходе из полноэкранного режима
          downloadTitle(LocalPars.txtPauseCurrent, LocalPars.HeaderCurrent);
          downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
      } else { // При работе в обычном режиме
          downloadTitle(LocalPars.txtPauseCurrent, LocalPars.HeaderCurrent);
      };
        LocalPars.playBtnCurrent = LocalPars.playBtnNext;
        LocalPars.stopTimer = 0;
        await chrome.storage.local.set({ titleCurrent: '' });
      } else {
        if (LocalPars.stopTimer === LocalPars.stop) { // При длительной паузе (равной stop)
          downloadTitle(LocalPars.txtStopCurrent, LocalPars.HeaderCurrent);
          downloadTitle(LocalPars.titleStopCurrent, LocalPars.TrackCurrent);
        };
        if (LocalPars.stopTimer <= LocalPars.stop) {
          LocalPars.stopTimer++;
        };
      };
    const { innerStop } = await chrome.storage.local.get("innerStop");
    if (innerStop) { // Выключение скрипта
      if (LocalPars.playBtnNext === 'Play') { // Остановка воспроизведения
        let playBtn = getPlayBtnYT();
        playBtn.click();
      };
      clearInterval(getMusic);
    }
  }
  LocalPars.fullScreenBtnCurrent = LocalPars.fullScreenBtnNext;
};

let getMusic = setInterval(() => getMusicTitleYT(), innerIntervalCD);