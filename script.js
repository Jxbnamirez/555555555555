// --- ส่วนของเครื่องเล่นเพลง ---
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(e => console.error("Autoplay blocked"));
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

audio.ontimeupdate = () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = pct + '%';
        currentTimeEl.innerText = formatTime(audio.currentTime);
    }
};

audio.onloadedmetadata = () => {
    durationEl.innerText = formatTime(audio.duration);
};

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
    }
});

audio.onended = () => {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    progress.style.width = '0%';
};

// --- ส่วนของเอฟเฟกต์หิมะ ---
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let width, height, snowflakes = [];

function setCanvasSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function createSnowflakes() {
    snowflakes = [];
    for (let i = 0; i < 150; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 4 + 1,
            d: Math.random() * 1
        });
    }
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    for (let flake of snowflakes) {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    moveSnowflakes();
}

let angle = 0;
function moveSnowflakes() {
    angle += 0.01;
    for (let flake of snowflakes) {
        flake.y += Math.pow(flake.d, 2) + 1 + flake.r / 2;
        flake.x += Math.sin(angle) * 2;
        if (flake.y > height) {
            flake.y = -10;
            flake.x = Math.random() * width;
        }
    }
}

function updateSnow() {
    drawSnowflakes();
    requestAnimationFrame(updateSnow);
}

window.addEventListener('resize', () => {
    setCanvasSize();
    createSnowflakes();
});

setCanvasSize();
createSnowflakes();
updateSnow();