// --- 1. ข้อมูลเพลงและวิดีโอ ---
const songs = [
    { 
        title: "YUNGTARR - blonde", 
        file: "song.mp3", 
        cover: "songcover.jpg",
        video: "ILLSLICK - ตีหนึ่งที่คูเมือง [Official Video].mp4" 
    },
    { 
        title: "YOUNG J - ข่าวลือ", 
        file: "YOUNG-J-ข่าวลือ-_Music-Video_.mp3", 
        cover: "songcover2.jpg",
        // แนะนำให้แปลงไฟล์ .mov เป็น .mp4 เพื่อความเสถียรสูงสุด
        video: "YOUNG-J-ข่าวลือ-_Music-Video_.mov" 
    }
];

let songIndex = 0;
const audio = document.getElementById('audio');
const bgVideo = document.getElementById('bg-video');
const videoSource = document.getElementById('video-source');

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('song-title');
const coverEl = document.getElementById('song-cover');

// ฟังก์ชันโหลดเนื้อหา
function loadContent(song) {
    titleEl.innerText = song.title;
    audio.src = song.file;
    coverEl.src = song.cover;
    
    // เปลี่ยนวิดีโอพื้นหลังพร้อมเช็คการเล่น
    bgVideo.style.opacity = "0"; // ค่อยๆ จางออกตอนเปลี่ยน
    videoSource.src = song.video;
    
    // สำคัญ: ต้องโหลดใหม่ทุกครั้งที่เปลี่ยน src
    bgVideo.load(); 
    
    // รอให้วิดีโอพร้อมเล่นแล้วค่อยแสดงผล
    bgVideo.oncanplay = () => {
        bgVideo.style.opacity = "1";
        bgVideo.play().catch(() => console.log("Video autoplay prevented"));
    };
}

// ฟังก์ชันควบคุมการเล่น
function togglePlay() {
    if (audio.paused) {
        const audioPromise = audio.play();
        if (audioPromise !== undefined) {
            audioPromise.then(() => {
                bgVideo.play(); // เล่นวิดีโอไปพร้อมกับเสียง
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => console.log("Playback error:", error));
        }
    } else {
        audio.pause();
        bgVideo.pause(); // หยุดวido ไปพร้อมกับเสียง
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// ฟังก์ชันเปลี่ยนเพลง
function changeSong(dir) {
    songIndex = (songIndex + dir + songs.length) % songs.length;
    loadContent(songs[songIndex]);
    
    // รอโหลดไฟล์เสียงเสร็จแล้วเล่นทันที
    audio.oncanplay = () => {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.oncanplay = null; // ลบ event ออกเพื่อไม่ให้ทำงานซ้ำ
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

// --- 2. เอฟเฟกต์หิมะ (ใช้โค้ดเดิมของคุณที่ทำงานได้ดีอยู่แล้ว) ---
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

// เริ่มต้นโหลดเนื้อหาเพลงแรก
loadContent(songs[songIndex]);
