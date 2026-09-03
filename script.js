// --- 1. ข้อมูลเพลงและวิดีโอ ---
const songs = [
    { 
        title: "loading - central cee", 
        file: "ssstik.io_1788400972110.mp3", 
        cover: "IMG_0700.jpeg",
        video: "snaptik_7679024904334740757_v3.mp4" 
    },
    { 
        title: "Beretta", 
        file: "ssstik.io_1788403678588.mp3", 
        cover: "IMG_0702.jpeg",
        video: "snaptik_7673838347806133511_v3.mp4" 
    }
];

let songIndex = 0;
const audio = document.getElementById('audio');
const bgVideo = document.getElementById('bg-video');
const videoSource = document.getElementById('video-source');

const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('song-title');
const coverEl = document.getElementById('song-cover');

// ฟังก์ชันอัปเดตไอคอนเล่น/หยุด
function updatePlayIcon(isPlaying) {
    if (!playIcon) return;
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

// ฟังก์ชันโหลดเนื้อหาเพลงและวิดีโอ
function loadContent(song) {
    titleEl.innerText = song.title;
    audio.src = song.file;
    coverEl.src = song.cover;
    
    // เปลี่ยนวิดีโอพื้นหลังพร้อมเอฟเฟกต์ Fade
    if (bgVideo && videoSource) {
        bgVideo.style.opacity = "0";
        videoSource.src = song.video;
        bgVideo.load(); 
        
        bgVideo.oncanplay = () => {
            bgVideo.style.opacity = "1";
            bgVideo.play().catch(() => console.log("Video autoplay prevented"));
        };
    }
}

// ฟังก์ชันควบคุมการเล่น/หยุด
function togglePlay() {
    if (audio.paused) {
        const audioPromise = audio.play();
        if (audioPromise !== undefined) {
            audioPromise.then(() => {
                if (bgVideo) bgVideo.play();
                updatePlayIcon(true);
            }).catch(error => console.log("Playback error:", error));
        }
    } else {
        audio.pause();
        if (bgVideo) bgVideo.pause();
        updatePlayIcon(false);
    }
}

// ฟังก์ชันเปลี่ยนเพลง
function changeSong(dir) {
    songIndex = (songIndex + dir + songs.length) % songs.length;
    loadContent(songs[songIndex]);
    
    audio.oncanplay = () => {
        audio.play();
        updatePlayIcon(true);
        audio.oncanplay = null;
    };
}

// --- Events Setup ---
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeSong(-1));
nextBtn.addEventListener('click', () => changeSong(1));

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

audio.onended = () => changeSong(1);

function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- 2. เอฟเฟกต์หิมะ (Snow Canvas) ---
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let w, h, flakes = [];

function initSnow() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    flakes = Array.from({ length: 140 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        d: Math.random() * 1
    }));
}

function drawSnow() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    flakes.forEach(f => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    });
    ctx.fill();
    flakes.forEach(f => {
        f.y += Math.pow(f.d, 2) + 0.8;
        f.x += Math.sin(f.d) * 0.4;
        if (f.y > h) f.y = -10, f.x = Math.random() * w;
    });
    requestAnimationFrame(drawSnow);
}

window.addEventListener('resize', initSnow);
initSnow();
drawSnow();

// โหลดเพลงแรกเริ่มต้น
loadContent(songs[songIndex]);
