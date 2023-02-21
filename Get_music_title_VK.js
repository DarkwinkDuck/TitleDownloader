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
    stop: 3, // Время паузы, после которой всё обнуляется (в секундах)
  }
  setTimeout(() => chrome.storage.session.set({innerStop: 0}), 1);
  chrome.storage.session.set({titleCurrent: ""});

function UnificeBotton() { // Приведение значения кнопки воспроизведения к универсальному
  switch(LocalPars.playBtnNext) {
    case 'Приостановить': LocalPars.playBtnNext = 'Play'
    break;
    case 'Воспроизвести': LocalPars.playBtnNext = 'Pause'
    break;
    case 'Pause': LocalPars.playBtnNext = 'Play'
    break;
    case 'Play': LocalPars.playBtnNext = 'Pause';
  }
};

function downloadTitle(text, fileName) { // Скачивание файла
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(text));
  element.setAttribute('download', fileName);
  element.click();
  delete element;
};

async function accessBugFixVK() { // Исправление бага с неправильной перезаписью при открытии плеера на некоторых страницах
  if ((LocalPars.subtitleOld === null)&&(LocalPars.subtitle !== null)) { // Проверка на открытие плеера
    if (LocalPars.subtitle.innerText !== '') { // Проверка наличия subtitle
      downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
      await chrome.storage.session.set({titleCurrent: LocalPars.titleNext});
    };
  }; 
};

function getPlayBtnVK() { // Получение доступа к кнопке воспроизведения
  let playBtn = document.querySelector('._top_audio_player_play');
  return playBtn
};

function writingTitleVK() { // Перезапись названия с учётом subtitle'а (вне зависимости от его наличия)
  let title = document.querySelector('.top_audio_player_title').innerText;
  LocalPars.subtitleOld = LocalPars.subtitle;
  LocalPars.subtitle = document.querySelector('.audio_page_player_title_song_subtitle');
  if (LocalPars.subtitle !== null) { // Проверка доступа к subtitle
    if (LocalPars.subtitle.innerText !== '') { // Проверка наличия subtitle
        let subtitletxt = LocalPars.subtitle.innerText; 
        title = `${title} (${subtitletxt})`;
    }
  }
  return title
};

async function getMusicTitleVK() { // Скачивание последующее
  alert(1);
  LocalPars.playBtnNext = getPlayBtnVK().innerText;
  UnificeBotton();
  LocalPars.titleNext = writingTitleVK();
  accessBugFixVK();
  if (LocalPars.playBtnNext === 'Play') {
    const {titleCurrent} = await chrome.storage.session.get('titleCurrent');
    if (LocalPars.titleNext !== titleCurrent) { // При переключении трека
        downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
        downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
        await chrome.storage.session.set({titleCurrent: LocalPars.titleNext});
    } else if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку воспроизведения
      downloadTitle(LocalPars.txtCurrentPlay, LocalPars.HeaderCurrent);
      if (LocalPars.stopTimer >= stop) {
        downloadTitle(LocalPars.titleNext, LocalPars.TrackCurrent);
      }
    };
    LocalPars.playBtnCurrent = LocalPars.playBtnNext;
  //} else if ((playBtnNext !== playBtnCurrent)&&(playBtnCurrent !== '')) { // При нажатии на кнопку паузы
  } else if (LocalPars.playBtnNext !== LocalPars.playBtnCurrent) { // При нажатии на кнопку паузы
    downloadTitle(LocalPars.txtPauseCurrent, LocalPars.HeaderCurrent);
    LocalPars.playBtnCurrent = LocalPars.playBtnNext;
    LocalPars.stopTimer = 0;
    } else {
      if (LocalPars.stopTimer === stop) { // При длительной паузе (равной stop)
        downloadTitle(LocalPars.txtStopCurrent, LocalPars.HeaderCurrent);
        downloadTitle(LocalPars.titleStopCurrent, LocalPars.TrackCurrent);
      }
      if (LocalPars.stopTimer <= stop) {
        LocalPars.stopTimer++;
      }
    };
    const { innerStop } = await chrome.storage.session.get("innerStop");
  if (innerStop) { // Выключение скрипта
    if (LocalPars.playBtnNext === 'Play') { // Остановка воспроизведения
      let playBtn = getPlayBtnVK();
      playBtn.click();
    };
    clearInterval(getMusic);
  }
};

let getMusic = setInterval( () => {getMusicTitleVK()}, innerIntervalCD);

