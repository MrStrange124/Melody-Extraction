// Initialize variables
let stream,
  recorder,
  audioBlobs = [];

function init() {
  const a1 = new Audio('./sample_humming.wav');
  const a2 = new Audio('./c-scale-metronome.wav');

  audioBlobs.push(a1);
  audioBlobs.push(a2);

  updateAudioList();
}

// Get reference to buttons and audio player
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const audioPlayer = document.getElementById('audioPlayer');
const audioContainer = document.getElementById('container');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');
const tnspButton = document.getElementById('AMT');
const tnsp = document.getElementById('tnsp');
const qbhButton = document.getElementById('QBH');
const query_list = document.getElementById('query_list');
const blur = document.getElementById('layer');
const waving = document.getElementById('waving');
const loader = document.getElementById('lodakaimg');

// attach click event listener to transcription button
tnspButton.addEventListener('click', () => {
  loader.style.display = 'block';
  query_list.style.display = 'none';

  setTimeout(() => {
    loader.style.display = 'none';
    tnsp.style.display = 'block';
  }, 2000);
});

// attach click event listener to QueryByHumming button
const res = [
  'Zara_Zara_Behkta_Hain',
  'Rook_Jana_Nahi',
  'ek_din_app_yun_hmko',
  'Aate_Jate_Khoobsurat_awara',
  'Kali_Kali_Zulfon_Ke',
];

qbhButton.addEventListener('click', function () {
  loader.style.display = 'block';
  tnsp.style.display = 'none';

  setTimeout(() => {
    loader.style.display = 'none';
    const songList = document.createElement('ul');

    res.forEach((str) => {
      const li = document.createElement('li');
      li.className = 'found_songs';
      li.textContent = str;
      songList.appendChild(li);
    });
    query_list.innerHTML = '<h3>Top Results</h3>';
    query_list.appendChild(songList);
    query_list.style.display = 'block';
  }, 2000);
});

// attach click event listener to each audio file li element
audioContainer.querySelectorAll('li').forEach((li) => {
  li.addEventListener('click', () => {
    const id = li.getAttribute('id');
    alert(`The ID of this audio file is: ${id}`);
  });
});

// attach click event listener to overlay close button
const overlayCloseButton = document.getElementById('overlay-close');

overlayCloseButton.addEventListener('click', () => {
  const overlay = document.getElementById('overlay');

  blur.style.display = 'none';
  overlay.style.display = 'none';
  tnsp.style.display = 'none';
  query_list.style.display = 'none';

  var ply = document.getElementById('audioPlayer');
  ply.src = '';
});

function updateAudioList() {
  let nextId = 1;
  const recordingList = document.createElement('ul');

  audioBlobs.forEach(function (audioBlob) {
    const li = document.createElement('li');

    li.textContent = `Recording-${nextId++}.wav`;

    li.addEventListener('click', () => {
      overlayContent.innerHTML = '';
      const recordingHead = document.createElement('h1');
      recordingHead.className = 'rhead';
      recordingHead.innerText = li.innerText;

      overlayContent.appendChild(recordingHead);
      blur.style.display = 'block';
      overlay.style.display = 'block';

      try {
        audioPlayer.src = URL.createObjectURL(audioBlob);
      } catch (error) {
        audioPlayer.src = audioBlob.src;
      }
      audioPlayer.style.display = 'block';
    });
    recordingList.appendChild(li);
  });

  audioContainer.innerHTML = ''; // Clear the contents of the target element
  audioContainer.appendChild(recordingList);
}

// Handle Start Recording button click
function startRecording() {
  recordBtn.innerText = 'Recording...';
  stopBtn.style.cursor = 'pointer';
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (audioStream) {
      stream = audioStream;
      recorder = new MediaRecorder(stream);

      // Handle data available event
      recorder.addEventListener('dataavailable', function (e) {
        audioBlob = e.data;
        audioBlobs.push(audioBlob);
        updateAudioList();
      });

      // Start recording
      recorder.start();
    })
    .catch(function (err) {
      console.error('Error: ' + err);
    });
}

// Handle Stop Recording button click
function stopRecording() {
  recordBtn.innerText = 'Record';
  stopBtn.style.cursor = 'not-allowed';
  console.log('STOPPED');
  if (recorder) {
    recorder.stop();
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
}

init();
