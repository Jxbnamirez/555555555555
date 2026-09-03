document.addEventListener("DOMContentLoaded", () => {
    // ====================================================
    // 1. รายชื่อเพลงใน Playlist (เพิ่ม/ลด เพลงตรงนี้ได้เลย)
    // ====================================================
    const playlist = [
        {
            title: "loading - central cee",
            cover: "song-cover.jpg",
            src: "Central Cee - Loading (JJ Drill Remix) prod. Cvplis.mp3"
        },
        {
            title: "doja - central cee",
            cover: "song-cover2.jpg",
            src: "song2.mp3"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // Element References
    const audio = document.getElementById("audio-player");
    const playBtn = document.getElementById("play-btn");
    const playIcon = document.getElementById("play-icon");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const songTitle = document.querySelector(".song-title");
    const songCover = document.querySelector(".song-cover");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");

    // ====================================================
    // 2. ฟังก์ชันควบคุมเครื่องเล่นเพลง
    // ====================================================

    // โหลดข้อมูลเพลงตาม Index
    function loadSong(index) {
        const song = playlist[index];
        songTitle.textContent = song.title;
        songCover.src = song.cover;
        audio.src = song.src;
    }

    // เล่นเพลง
    function playSong() {
        isPlaying = true;
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
        audio.play();
    }

    // หยุดเพลง
    function pauseSong() {
        isPlaying = false;
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
        audio.pause();
    }

    // สลับ เล่น/หยุด
    playBtn.addEventListener("click", () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // เพลงก่อนหน้า (Prev)
    prevBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    });

    // เพลงถัดไป (Next)
    nextBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    });

    // เมื่อจบเพลง ให้เล่นเพลงถัดไปอัตโนมัติ
    audio.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    });

    // อัปเดตแถบ Progress และเวลา
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            // คำนวณเวลาปัจจุบัน
            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSeconds = Math.floor(audio.currentTime % 60);
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

            // คำนวณเวลารวม
            const durationMinutes = Math.floor(audio.duration / 60);
            const durationSeconds = Math.floor(audio.duration % 60);
            durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        }
    });

    // คลิกบนแถบเวลาเพื่อกรอเพลง
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });

    // โหลดเพลงแรกไว้เริ่มต้น
    loadSong(currentSongIndex);

    // ====================================================
    // 3. เอฟเฟกต์หิมะตก (Snow Animation Canvas)
    // ====================================================
    const canvas = document.getElementById("snow-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const numFlakes = 80;
        const flakes = [];

        for (let i = 0; i < numFlakes; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.7 + 0.3
            });
        }

        function drawSnow() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "white";

            for (let flake of flakes) {
                ctx.beginPath();
                ctx.globalAlpha = flake.opacity;
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fill();

                flake.y += flake.speed;
                if (flake.y > height) {
                    flake.y = -5;
                    flake.x = Math.random() * width;
                }
            }
            requestAnimationFrame(drawSnow);
        }

        drawSnow();
    }
});
