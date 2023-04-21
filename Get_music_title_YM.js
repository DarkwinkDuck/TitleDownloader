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
  stop: 10, // Время паузы, после которой всё обнуляется (в секундах)
}
setTimeout(() => chrome.storage.local.set({ innerStop: 0 }), 1);
chrome.storage.local.set({ titleCurrent: "" });

function UnificeBotton() { // Приведение значения кнопки воспроизведения к универсальному
  switch (LocalPars.playBtnNext) {
    case 'Играть [P]': LocalPars.playBtnNext = 'Pause'
      break;
    case 'Пауза [P]': LocalPars.playBtnNext = 'Play'
      break;
    case 'Play [P]': LocalPars.playBtnNext = 'Pause'
      break;
    case 'Pause [P]': LocalPars.playBtnNext = 'Play';
  }
};

function downloadTitle(text, fileName) { // Скачивание файла
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text + "   "));
  element.setAttribute('download', fileName);
  element.click();
  delete element;
};

function getPlayBtnYM() { // Получение доступа к кнопке воспроизведения
  let playBtn = document.querySelector('.player-controls__btn_play');
  return playBtn
};

function writingTitleYM() { // Перезапись названия
  let artist = document.querySelector('.track__name-innerwrap').innerText;
  let title = document.querySelector('.track__artists.deco-link.deco-link_no-hover-color').innerText;
  title = `${artist} - ${title}`;
  return title
};

async function getMusicTitleYM() { // Скачивание последующее
  let { titleCurrent } = await chrome.storage.local.get('titleCurrent');
  LocalPars.playBtnNext = getPlayBtnYM().title;
  UnificeBotton();
  LocalPars.titleNext = writingTitleYM();
  if (LocalPars.playBtnNext === 'Play') {
    if (LocalPars.titleNext !== titleCurrent) { // При переключении трека и нажатии на кнопку воспроизведения
      downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
      downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
      await chrome.storage.local.set({ titleCurrent: LocalPars.titleNext });
    };
    LocalPars.playBtnCurrent = LocalPars.playBtnNext;
  } else if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку паузы
    downloadTitle(LocalPars.txtPauseCurrent, LocalPars.HeaderCurrent);
    LocalPars.playBtnCurrent = LocalPars.playBtnNext;
    LocalPars.stopTimer = 0;
    await chrome.storage.local.set({ titleCurrent: '' });
  } else {
    if (LocalPars.stopTimer === LocalPars.stop) { // При длительной паузе (равной stop)
      downloadTitle(LocalPars.txtStopCurrent, LocalPars.HeaderCurrent);
      downloadTitle(LocalPars.titleStopCurrent, LocalPars.TrackCurrent);
    }
    if (LocalPars.stopTimer <= LocalPars.stop) {
      LocalPars.stopTimer++;
    }
  };
  const { innerStop } = await chrome.storage.local.get("innerStop");
  if (innerStop) { // Выключение скрипта
    if (LocalPars.playBtnNext === 'Play') { // Остановка воспроизведения
      let playBtn = getPlayBtnYM();
      playBtn.click();
    };
    clearInterval(getMusic);
  }
};

let getMusic = setInterval(() => getMusicTitleYM(), innerIntervalCD);