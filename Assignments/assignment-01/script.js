const songs = [
  { title: "Rue the Whirl", file: "rue_the_whirl.mp3", bg: "rue_the_whirl.jpg" },
  { title: "Transitions", file: "transition.mp3", bg: "transition.jpg" },
  { title: "Endless Love", file: "endless_love.mp3", bg: "endless_love.jpg" },
  { title: "Teen Town", file: "teen_town.mp3", bg: "teen_town.jpg" },
  { title: "Gun Street Girl", file: "gun_street_girl.mp3", bg: "gun_street_girl.jpg" },
  { title: "Construção", file: "costrucao.mp3", bg: "costrucao.jpg" }
];

const wrapper = document.querySelector('.wrapper');
const outer = document.querySelector('.outer-circles');
const center = document.querySelector('.center-circle');
const body = document.body;

const initialBackground = "background.JPG";
document.body.style.backgroundImage = `url('assets/${initialBackground}')`;


songs.forEach((song, i) => {
  const circle = document.createElement('div');
  circle.classList.add('small-circle');
  circle.dataset.file = song.file;
  circle.dataset.bg = song.bg;
  const label = document.createElement('span');
  label.classList.add('circle-label');
  label.textContent = song.title;
  circle.appendChild(label)
  outer.appendChild(circle);
});

function positionCircles() {
  const radius = Math.min(wrapper.clientWidth, wrapper.clientHeight) * 0.5;
  const centerX = wrapper.clientWidth / 2;
  const centerY = wrapper.clientHeight / 2;
  const exampleCircle = document.querySelector('.small-circle');
  const circleSize = parseFloat(getComputedStyle(exampleCircle).width);
  console.log("Dimensione cerchio:", circleSize);

  document.querySelectorAll('.small-circle').forEach((circle, i) => {
  const angle = (i / songs.length) * (2 * Math.PI);
  const x = Math.cos(angle) * radius + centerX - circleSize / 2;
  const y = Math.sin(angle) * radius + centerY - circleSize / 2;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  console.log(`Cerchio ${i}: x=${x}, y=${y}`);
});
}

positionCircles();

window.addEventListener('resize', positionCircles);

const centerLabel = document.getElementById('center-label');
let currentAudio = null;

// Hover per scegliere canzone
center.addEventListener('mouseenter', () => {
wrapper.classList.add('expanded');
});

wrapper.addEventListener('mouseleave', () => {
wrapper.classList.remove('expanded');
});

let clickTimer = null;

outer.addEventListener('click', (e) => {
  const circle = e.target.closest('.small-circle');
  if (!circle) return;

  // Doppio click
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;

    circle.classList.toggle('favorite');
    updateFavoriteVisibility();
    return;
  }

  // Singolo click
  clickTimer = setTimeout(() => {
    clickTimer = null;

    const file = circle.dataset.file;
    const bg = circle.dataset.bg;

    // Ferma eventuale audio in corso
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Avvia nuovo audio
    currentAudio = new Audio(`assets/${file}`);
    currentAudio.play();

    // Aggiorna sfondo e testo
    document.body.style.backgroundImage = `url('assets/${bg}')`;
    centerLabel.textContent = "STOP";
  }, 250); // tempo di distinzione tra click e doppio click
});

// Stop musica
center.addEventListener('click', () => {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    console.log("Song Stopped");
    document.body.style.backgroundImage = `url('assets/${initialBackground}')`;
    centerLabel.textContent = "CHOOSE";
  }
});

// Visibilità preferiti
function updateFavoriteVisibility() {
  document.querySelectorAll('.small-circle').forEach(circle => {
    if (circle.classList.contains('favorite')) {
      circle.classList.add('favorite-visible');
    } else {
      circle.classList.remove('favorite-visible');
    }
  });
}