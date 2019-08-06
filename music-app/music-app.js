let repeat = false;
let shuffle = false;

// 재생과 일시정지 이벤트
function handlePlay(audio) {
  const playBtn = document.querySelector(".play");
  const pauseBtn = document.querySelector(".pause");
  playBtn.addEventListener("click", function() {
    pauseBtn.style.display = "block";
    playBtn.style.display = "none";
    audio.play();
  });
  pauseBtn.addEventListener("click", function() {
    pauseBtn.style.display = "none";
    playBtn.style.display = "block";
    audio.pause();
  });
}

// 진행 바 상태 변경
function showProgress(audio) {
  const progress = audio.currentTime / audio.duration;
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = progress * 100 + "%";
}

// 왼쪽 경과 시간
function showElapsedTime(audio) {
  const elapsedTime = document.querySelector(".elapsed");
  const currentTime = audio.currentTime;
  const minute = Math.floor(currentTime / 60)
    .toString()
    .padStart(2, 0);
  const seconds = Math.floor(currentTime - Number(minute) * 60)
    .toString()
    .padStart(2, 0);
  const elapsedText = `${minute}:${seconds}`;
  elapsedTime.innerHTML = elapsedText;
}

// 우측 총 시간
function handleTime(audio) {
  const totalTime = document.querySelector(".total");
  const minute = Math.floor(audio.duration / 60)
    .toString()
    .padStart(2, 0);
  const seconds = Math.floor(audio.duration - Number(minute) * 60)
    .toString()
    .padStart(2, 0);
  const duration = `${minute}:${seconds}`;

  totalTime.innerHTML = duration;
}

function changeSong(newSong) {
  const playBtn = document.querySelector(".play");
  const pauseBtn = document.querySelector(".pause");
  document.querySelector(".music-title").innerHTML = newSong.title;
  document.querySelector(".music-artist").innerHTML = newSong.artist;
  document.querySelector(".elapsed").innerHTML = "00:00";
  document.querySelector("#album-cover").src = newSong.cover;
  audio.dataset.musicId = newSong.id;
  audio.src = newSong.audio;
  pauseBtn.style.display = "block";
  playBtn.style.display = "none";
  audio.play();
}

function prevSong(audio) {
  const id = audio.dataset.musicId == 1 ? 11 : audio.dataset.musicId;
  const url = `http://localhost:3000/prev?id=${id}`;
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.onload = function() {
    changeSong(request.response);
  };
  request.send();
}

function nextSong(audio) {
  const id = audio.dataset.musicId == 10 ? 0 : audio.dataset.musicId;
  const url = `http://localhost:3000/next?id=${id}`;
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.onload = function() {
    changeSong(request.response);
  };
  request.send();
}

// 곡이 끝났을 때
function handleAudioEnd(audio) {
  const playBtn = document.querySelector(".play");
  const pauseBtn = document.querySelector(".pause");

  pauseBtn.style.display = "none";
  playBtn.style.display = "block";
  if (repeat || !audio.dataset.id == 10) {
    nextSong(audio);
  }
}

function init() {
  const audio = document.getElementById("audio");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const repeatBtn = document.querySelector(".repeat");
  const shuffleBtn = document.querySelector(".shuffle");

  repeatBtn.addEventListener("click", function() {
    if (repeatBtn.classList.contains("on")) {
      repeat = false;
      repeatBtn.classList.remove("on");
    } else {
      repeat = true;
      repeatBtn.classList.add("on");
    }
  });

  shuffleBtn.addEventListener("click", function() {
    if (shuffleBtn.classList.contains("on")) {
      shuffle = false;
      shuffleBtn.classList.remove("on");
    } else {
      shuffle = true;
      shuffleBtn.classList.add("on");
    }
  });

  audio.addEventListener("ended", function() {
    handleAudioEnd(audio);
  });

  prev.addEventListener("click", function() {
    prevSong(audio);
  });

  next.addEventListener("click", function() {
    nextSong(audio);
  });

  audio.oncanplay = function() {
    handlePlay(audio);
    handleTime(audio);
  };

  setInterval(showElapsedTime, 1000, audio);
  setInterval(showProgress, 10, audio);
}

init();
