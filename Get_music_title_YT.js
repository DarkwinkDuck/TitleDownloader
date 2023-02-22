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
  stop: 3, // Время паузы, после которой всё обнуляется (в секундах)
  fullScreenBtnNext: '',
  fullScreenBtnCurrent: '',
}
setTimeout(() => chrome.storage.session.set({ innerStop: 0 }), 1);
chrome.storage.session.set({ titleCurrent: "" });

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
  element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text));
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
  if (fullScreenFix()) {
    if (LocalPars.fullScreenBtnNext !== LocalPars.fullScreenBtnCurrent) { // Исправление работы при полноэкранном режиме
      LocalPars.titleNext = LocalPars.titleFullScreen;
      downloadTitle(LocalPars.txtFullScreen, LocalPars.HeaderCurrent);
      downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
      LocalPars.fullScreenBtnCurrent = LocalPars.fullScreenBtnNext;
    }
  } else {
    LocalPars.playBtnNext = getPlayBtnYT().title;
    UnificeBotton();
    LocalPars.titleNext = writingTitleYT();
    if (LocalPars.playBtnNext === 'Play') {
      if (!mainPageFixYT()) { // Для страницы воспроизведения
        const { titleCurrent } = await chrome.storage.session.get('titleCurrent');
        if (LocalPars.titleNext !== titleCurrent) { // При переключении трека
          downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
          downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
          await chrome.storage.session.set({ titleCurrent: LocalPars.titleNext });
        } else if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку воспроизведения
          downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
          if (LocalPars.stopTimer >= LocalPars.stop) {
            downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
          }
        };
        LocalPars.playBtnCurrent = LocalPars.playBtnNext;
      }
    } else // Для всех страниц
      //if ((LocalPars.playBtnNext !== LocalPars.playBtnCurrent)&&(LocalPars.playBtnCurrent !== '')) { // При нажатии на кнопку паузы
      if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку паузы
        downloadTitle(LocalPars.txtPauseCurrent, LocalPars.HeaderCurrent);
        LocalPars.playBtnCurrent = LocalPars.playBtnNext;
        LocalPars.stopTimer = 0;
      } else {
        if (LocalPars.stopTimer === LocalPars.stop) { // При длительной паузе (равной stop)
          downloadTitle(LocalPars.txtStopCurrent, LocalPars.HeaderCurrent);
          downloadTitle(LocalPars.titleStopCurrent, LocalPars.TrackCurrent);
        };
        if (LocalPars.stopTimer <= LocalPars.stop) {
          LocalPars.stopTimer++;
        };
      };
    const { innerStop } = await chrome.storage.session.get("innerStop");
    if (innerStop) { // Выключение скрипта
      if (LocalPars.playBtnNext === 'Play') { // Остановка воспроизведения
        let playBtn = getPlayBtnYT();
        playBtn.click();
      };
      clearInterval(getMusic);
    }
  }
};

let getMusic = setInterval(() => getMusicTitleYT(), innerIntervalCD);
