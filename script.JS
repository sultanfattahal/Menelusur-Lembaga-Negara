// Game State
let playerName = '';
let currentLocation = 0;
let visitedLocations = new Set();
let completedLocations = new Set();
let currentDialogStep = 0;
let gameStartTime = 0;
let gameTimer = null;
let perfectScore = true;
let correctAnswers = 0;
let titleClickCount = 0;
let npcClickCount = 0;
let konamiCode = [];
let konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let typedText = '';

// Easter Eggs State
let easterEggs = {
    konami: { found: false, name: "🎮 Konami Master", description: "Menemukan kode rahasia ↑↑↓↓←→←→BA" },
    clickMaster: { found: false, name: "🖱️ Click Master", description: "Mengklik judul game 10 kali" },
    speedRunner: { found: false, name: "🏃 Speed Runner", description: "Menyelesaikan game dalam 2 menit" },
    dramaQueen: { found: false, name: "🎭 Drama Queen", description: "Mengklik NPC 5 kali berturut-turut" },
    secretDance: { found: false, name: "🎪 Secret Dance", description: "Mengetik 'PANCASILA' di mana saja" }
};

const locations = [
    {
        id: 0,
        name: "🏛️ Gedung DPR RI",
        description: "Dewan Perwakilan Rakyat - Lembaga Legislatif",
        npc: "👨‍💼",
        npcName: "Pak Budi - Anggota DPR",
        dialogs: [
            "Selamat datang di Gedung DPR RI, {name}! Saya Pak Budi, anggota DPR.",
            "DPR memiliki tiga fungsi utama: legislasi, anggaran, dan pengawasan.",
            "Kami bersama Presiden membentuk undang-undang untuk kemajuan bangsa.",
            "Apakah kamu tahu siapa yang berwenang mengawasi jalannya pemerintahan, {name}?"
        ],
        question: "Lembaga negara yang berfungsi mengawasi jalannya pemerintahan adalah...",
        answers: [
            { text: "DPR", correct: true },
            { text: "DPD", correct: false },
            { text: "BPK", correct: false },
            { text: "MPR", correct: false }
        ],
        explanation: "Benar! DPR memiliki fungsi pengawasan terhadap jalannya pemerintahan."
    },
    {
        id: 1,
        name: "🏢 Gedung MPR RI",
        description: "Majelis Permusyawaratan Rakyat - Lembaga Tertinggi",
        npc: "👩‍⚖️",
        npcName: "Bu Sari - Anggota MPR",
        dialogs: [
            "Halo {name}! Saya Bu Sari dari MPR. Selamat datang di gedung bersejarah ini!",
            "MPR adalah lembaga tertinggi negara yang terdiri dari DPR dan DPD.",
            "Kami bertugas melantik Presiden dan Wakil Presiden yang terpilih.",
            "MPR juga berwenang mengubah dan menetapkan UUD 1945. Mari kita uji pengetahuanmu, {name}!"
        ],
        question: "Siapakah yang melantik Presiden dan Wakil Presiden terpilih?",
        answers: [
            { text: "Mahkamah Konstitusi", correct: false },
            { text: "DPR", correct: false },
            { text: "MPR", correct: true },
            { text: "BPK", correct: false }
        ],
        explanation: "Tepat! MPR yang melantik Presiden dan Wakil Presiden terpilih."
    },
    {
        id: 2,
        name: "⚖️ Mahkamah Agung",
        description: "Lembaga Yudikatif Tertinggi",
        npc: "👨‍⚖️",
        npcName: "Hakim Agung Wijaya",
        dialogs: [
            "Selamat datang di Mahkamah Agung, {name}! Saya Hakim Agung Wijaya.",
            "MA adalah puncak kekuasaan kehakiman di Indonesia.",
            "Kami mengadili perkara kasasi, peninjauan kembali, dan sengketa kewenangan.",
            "Tahukah kamu lembaga mana yang mengajukan calon hakim agung, {name}?"
        ],
        question: "Lembaga yang berwenang mengajukan calon hakim agung adalah...",
        answers: [
            { text: "DPR", correct: false },
            { text: "Komisi Yudisial", correct: true },
            { text: "Mahkamah Agung", correct: false },
            { text: "Mahkamah Konstitusi", correct: false }
        ],
        explanation: "Benar! Komisi Yudisial yang mengajukan calon hakim agung kepada DPR."
    },
    {
        id: 3,
        name: "🏛️ Mahkamah Konstitusi",
        description: "Pengawal Konstitusi Indonesia",
        npc: "👩‍⚖️",
        npcName: "Hakim Konstitusi Nina",
        dialogs: [
            "Halo {name}! Saya Hakim Konstitusi Nina. Selamat datang di MK!",
            "Mahkamah Konstitusi adalah pengawal konstitusi Indonesia.",
            "Kami menguji undang-undang terhadap UUD 1945 dan memutus sengketa pemilu.",
            "MK juga memutus pembubaran partai politik. Ayo uji pemahamanmu, {name}!"
        ],
        question: "Lembaga yang berwenang menguji undang-undang terhadap UUD 1945 adalah...",
        answers: [
            { text: "DPR", correct: false },
            { text: "MPR", correct: false },
            { text: "Mahkamah Agung", correct: false },
            { text: "Mahkamah Konstitusi", correct: true }
        ],
        explanation: "Tepat sekali! MK berwenang menguji undang-undang terhadap UUD 1945."
    },
    {
        id: 4,
        name: "🏢 Gedung BPK RI",
        description: "Badan Pemeriksa Keuangan",
        npc: "👨‍💼",
        npcName: "Pak Andi - Auditor BPK",
        dialogs: [
            "Selamat datang di BPK, {name}! Saya Pak Andi, auditor senior di sini.",
            "BPK bertugas memeriksa pengelolaan dan tanggung jawab keuangan negara.",
            "Kami memastikan uang rakyat digunakan dengan benar dan transparan.",
            "Hasil pemeriksaan kami dilaporkan kepada DPR, DPD, dan DPRD, {name}."
        ],
        question: "Yang bertugas memeriksa pengelolaan dan tanggung jawab keuangan negara adalah...",
        answers: [
            { text: "KPK", correct: false },
            { text: "BPK", correct: true },
            { text: "Mahkamah Agung", correct: false },
            { text: "Ombudsman", correct: false }
        ],
        explanation: "Benar! BPK yang bertugas memeriksa keuangan negara."
    },
    {
        id: 5,
        name: "🏛️ Gedung DPD RI",
        description: "Dewan Perwakilan Daerah",
        npc: "👩‍💼",
        npcName: "Bu Ratna - Anggota DPD",
        dialogs: [
            "Halo {name}! Saya Bu Ratna, mewakili daerah di DPD.",
            "DPD adalah perwakilan daerah-daerah di tingkat nasional.",
            "Anggota DPD berasal dari setiap provinsi di Indonesia.",
            "Kami mengusulkan RUU yang berkaitan dengan otonomi daerah, {name}."
        ],
        question: "Anggota DPD berasal dari...",
        answers: [
            { text: "Perwakilan partai politik", correct: false },
            { text: "Daerah pemilihan tingkat provinsi", correct: true },
            { text: "Kementerian", correct: false },
            { text: "Organisasi masyarakat", correct: false }
        ],
        explanation: "Tepat! Anggota DPD berasal dari daerah pemilihan tingkat provinsi."
    },
    {
        id: 6,
        name: "🏢 Istana Negara",
        description: "Kediaman Resmi Presiden RI",
        npc: "👨‍💼",
        npcName: "Sekretaris Presiden",
        dialogs: [
            "Selamat datang di Istana Negara, {name}! Saya Sekretaris Presiden.",
            "Presiden adalah kepala negara dan kepala pemerintahan Indonesia.",
            "Beliau memiliki kewenangan mengangkat dan memberhentikan menteri.",
            "Presiden juga bersama DPR membentuk undang-undang, {name}."
        ],
        question: "Siapakah yang memiliki kewenangan membentuk undang-undang di Indonesia?",
        answers: [
            { text: "DPR bersama Presiden", correct: true },
            { text: "MPR", correct: false },
            { text: "DPD", correct: false },
            { text: "Presiden saja", correct: false }
        ],
        explanation: "Benar! DPR bersama Presiden yang membentuk undang-undang."
    },
    {
        id: 7,
        name: "🏛️ Gedung Komisi Yudisial",
        description: "Pengawas Perilaku Hakim",
        npc: "👩‍⚖️",
        npcName: "Bu Indira - Anggota KY",
        dialogs: [
            "Halo {name}! Saya Bu Indira dari Komisi Yudisial.",
            "KY bertugas mengawasi perilaku hakim dan mengajukan calon hakim agung.",
            "Kami memastikan hakim bekerja dengan integritas tinggi.",
            "KY juga menjaga kehormatan dan keluhuran martabat hakim, {name}."
        ],
        question: "Presiden sebagai kepala negara memiliki kewenangan untuk...",
        answers: [
            { text: "Membentuk undang-undang sendiri", correct: false },
            { text: "Mengangkat dan memberhentikan menteri", correct: true },
            { text: "Mengawasi DPR", correct: false },
            { text: "Menguji undang-undang", correct: false }
        ],
        explanation: "Tepat! Presiden berwenang mengangkat dan memberhentikan menteri."
    },
    {
        id: 8,
        name: "🏢 Gedung KPU RI",
        description: "Komisi Pemilihan Umum",
        npc: "👨‍💼",
        npcName: "Pak Dedi - Komisioner KPU",
        dialogs: [
            "Selamat datang di KPU, {name}! Saya Pak Dedi, komisioner KPU.",
            "KPU menyelenggarakan pemilihan umum yang jujur dan adil.",
            "Kami memastikan setiap warga negara dapat menggunakan hak pilihnya.",
            "Jika ada sengketa hasil pemilu, ada lembaga khusus yang menanganinya, {name}."
        ],
        question: "Siapakah yang berwenang memutus sengketa hasil pemilihan umum?",
        answers: [
            { text: "DPR", correct: false },
            { text: "Mahkamah Agung", correct: false },
            { text: "Mahkamah Konstitusi", correct: true },
            { text: "Komisi Pemilihan Umum", correct: false }
        ],
        explanation: "Benar! Mahkamah Konstitusi yang memutus sengketa hasil pemilu."
    },
    {
        id: 9,
        name: "🏛️ Gedung Sekretariat Negara",
        description: "Pusat Administrasi Negara",
        npc: "👩‍💼",
        npcName: "Bu Maya - Sekretaris Negara",
        dialogs: [
            "Selamat datang, {name}! Saya Bu Maya dari Sekretariat Negara.",
            "Setneg membantu Presiden dalam menjalankan pemerintahan.",
            "Kami mengkoordinasikan berbagai lembaga negara.",
            "Mari kita uji pemahaman terakhir tentang fungsi DPR, {name}!"
        ],
        question: "Lembaga negara yang memiliki fungsi legislasi, anggaran, dan pengawasan adalah...",
        answers: [
            { text: "MPR", correct: false },
            { text: "DPR", correct: true },
            { text: "DPD", correct: false },
            { text: "KPU", correct: false }
        ],
        explanation: "Tepat sekali! DPR memiliki tiga fungsi: legislasi, anggaran, dan pengawasan."
    }
];

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    loadEasterEggs();
    setupEventListeners();
});

function setupEventListeners() {
    // Title click counter for easter egg
    document.getElementById('gameTitle').addEventListener('click', function() {
        titleClickCount++;
        if (titleClickCount >= 10 && !easterEggs.clickMaster.found) {
            unlockEasterEgg('clickMaster');
            document.getElementById('gameTitle').classList.add('rainbow-text');
        }
    });
    
    // Konami code listener
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            if (!easterEggs.konami.found) {
                unlockEasterEgg('konami');
                document.getElementById('gameContainer').classList.add('spin-screen');
                setTimeout(() => {
                    document.getElementById('gameContainer').classList.remove('spin-screen');
                }, 3000);
            }
        }
        
        // Secret dance code
        typedText += e.key.toUpperCase();
        if (typedText.length > 9) {
            typedText = typedText.slice(-9);
        }
        
        if (typedText === 'PANCASILA' && !easterEggs.secretDance.found) {
            unlockEasterEgg('secretDance');
            document.getElementById('gameContainer').classList.add('dance-screen', 'rainbow-text');
            setTimeout(() => {
                document.getElementById('gameContainer').classList.remove('dance-screen', 'rainbow-text');
            }, 2000);
        }
    });
    
    // Player name input
    document.getElementById('playerName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitName();
        }
    });
}

function submitName() {
    const nameInput = document.getElementById('playerName').value.trim();
    if (nameInput === '') {
        alert('Mohon masukkan nama kamu terlebih dahulu! 😊');
        return;
    }
    
    playerName = nameInput;
    document.getElementById('welcomeName').textContent = playerName;
    
    document.getElementById('nameScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('nameScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('startScreen').classList.add('fade-in');
    }, 500);
}

function startGame() {
    gameStartTime = Date.now();
    perfectScore = true;
    
    document.getElementById('startScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('mapScreen').classList.remove('hidden');
        document.getElementById('mapScreen').classList.add('fade-in');
        document.getElementById('mapPlayerName').textContent = playerName;
        initializeMap();
        startTimer();
    }, 500);
}

function startTimer() {
    gameTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function initializeMap() {
    const mapGrid = document.querySelector('.map-grid');
    mapGrid.innerHTML = '';
    
    locations.forEach((location, index) => {
        const locationCard = document.createElement('div');
        locationCard.className = `location-card bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl text-center building-glow`;
        
        if (completedLocations.has(index)) {
            locationCard.classList.add('completed');
        } else if (index === 0 || visitedLocations.has(index - 1)) {
            locationCard.classList.add('current');
        }
        
        locationCard.innerHTML = `
            <div class="text-4xl mb-3">${location.name.split(' ')[0]}</div>
            <h3 class="font-semibold mb-2">${location.name.substring(3)}</h3>
            <p class="text-sm text-gray-300 mb-3">${location.description}</p>
            <div class="text-2xl mb-2">${location.npc}</div>
            <p class="text-xs text-gray-400">${location.npcName}</p>
            ${completedLocations.has(index) ? '<div class="text-green-400 mt-2">✅ Selesai</div>' : ''}
        `;
        
        if (index === 0 || visitedLocations.has(index - 1) || completedLocations.has(index)) {
            locationCard.onclick = () => visitLocation(index);
        } else {
            locationCard.style.opacity = '0.5';
            locationCard.style.cursor = 'not-allowed';
        }
        
        mapGrid.appendChild(locationCard);
    });
    
    updateStats();
}

function visitLocation(locationId) {
    if (locationId > 0 && !visitedLocations.has(locationId - 1) && !completedLocations.has(locationId)) {
        return;
    }
    
    currentLocation = locationId;
    currentDialogStep = 0;
    npcClickCount = 0;
    visitedLocations.add(locationId);
    
    document.getElementById('mapScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('mapScreen').classList.add('hidden');
        document.getElementById('locationScreen').classList.remove('hidden');
        document.getElementById('locationScreen').classList.add('fade-in');
        loadLocation();
    }, 500);
}

function loadLocation() {
    const location = locations[currentLocation];
    
    document.getElementById('locationTitle').textContent = location.name;
    document.getElementById('locationDescription').textContent = location.description;
    document.getElementById('npcAvatar').textContent = location.npc;
    document.getElementById('npcName').textContent = location.npcName;
    
    // Add NPC click listener for easter egg
    document.getElementById('npcAvatar').onclick = function() {
        npcClickCount++;
        if (npcClickCount >= 5 && !easterEggs.dramaQueen.found) {
            unlockEasterEgg('dramaQueen');
            this.classList.add('npc-dance');
            setTimeout(() => {
                this.classList.remove('npc-dance');
            }, 3000);
        }
    };
    
    document.getElementById('questionSection').classList.add('hidden');
    document.getElementById('dialogSection').classList.remove('hidden');
    
    showDialog();
}

function showDialog() {
    const location = locations[currentLocation];
    const dialogText = document.getElementById('dialogText');
    const continueBtn = document.getElementById('continueDialog');
    
    if (currentDialogStep < location.dialogs.length) {
        const dialog = location.dialogs[currentDialogStep].replace(/{name}/g, playerName);
        dialogText.textContent = dialog;
        
        if (currentDialogStep < location.dialogs.length - 1) {
            continueBtn.classList.remove('hidden');
        } else {
            continueBtn.classList.add('hidden');
            setTimeout(() => {
                showQuestion();
            }, 2000);
        }
    }
}

function continueDialog() {
    currentDialogStep++;
    showDialog();
}

function showQuestion() {
    const location = locations[currentLocation];
    
    document.getElementById('dialogSection').classList.add('hidden');
    document.getElementById('questionSection').classList.remove('hidden');
    
    document.getElementById('questionText').textContent = location.question;
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    location.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer.text}`;
        button.onclick = () => selectAnswer(answer.correct, button, location.explanation);
        answersContainer.appendChild(button);
    });
}

function selectAnswer(isCorrect, buttonElement, explanation) {
    const buttons = document.querySelectorAll('#answersContainer button');
    buttons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        buttonElement.className = 'w-full bg-green-600 p-4 rounded-lg text-left';
        completedLocations.add(currentLocation);
        correctAnswers++;
        
        setTimeout(() => {
            alert(`✅ Benar, ${playerName}! ${explanation}`);
            
            if (completedLocations.size === locations.length) {
                stopTimer();
                const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
                
                // Check for speed runner easter egg
                if (gameTime <= 120 && !easterEggs.speedRunner.found) {
                    unlockEasterEgg('speedRunner');
                }
                
                saveScore(gameTime, correctAnswers);
                showEndingByScore(correctAnswers, gameTime);
            } else {
                backToMap();
            }
        }, 1000);
    } else {
        perfectScore = false;
        buttonElement.className = 'w-full bg-red-600 p-4 rounded-lg text-left';
        
        document.getElementById('gameContainer').classList.add('shake');
        setTimeout(() => {
            document.getElementById('gameContainer').classList.remove('shake');
        }, 600);
        
        setTimeout(() => {
            alert(`❌ Jawaban kurang tepat, ${playerName}. Coba lagi!`);
            showQuestion();
        }, 1500);
    }
}

function backToMap() {
    document.getElementById('locationScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('locationScreen').classList.add('hidden');
        document.getElementById('mapScreen').classList.remove('hidden');
        document.getElementById('mapScreen').classList.add('fade-in');
        initializeMap();
    }, 500);
}

function showEndingByScore(correctCount, gameTime) {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    
    document.getElementById('locationScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('locationScreen').classList.add('hidden');
        
        if (correctCount === 10) {
            // Perfect Score - Secret Ending
            document.getElementById('secretVictoryScreen').classList.remove('hidden');
            document.getElementById('secretVictoryScreen').classList.add('fade-in');
            document.getElementById('secretEasterEggCount').textContent = Object.values(easterEggs).filter(egg => egg.found).length;
            
            // Update secret victory screen with player name
            document.getElementById('secretPlayerName').textContent = `${playerName}, Sempurna! Tidak ada kesalahan!`;
            document.getElementById('secretPlayerMessage').textContent = `${playerName}, kamu adalah ahli tata negara sejati dengan pengetahuan yang luar biasa!`;
            document.getElementById('secretGarudaMessage').textContent = `Garuda terbang tinggi menghormati kepintaran ${playerName}!`;
        } else {
            // Other endings based on score
            document.getElementById('victoryScreen').classList.remove('hidden');
            document.getElementById('victoryScreen').classList.add('fade-in');
            
            let endingContent = getEndingContent(correctCount, gameTime, minutes, seconds);
            document.getElementById('victoryContent').innerHTML = endingContent;
        }
    }, 500);
}

function getEndingContent(correctCount, gameTime, minutes, seconds) {
    const easterEggCount = Object.values(easterEggs).filter(egg => egg.found).length;
    
    if (correctCount >= 9) {
        // Excellent Ending (9-10 benar)
        return `
            <div class="building-glow bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 mb-8">
                <div class="text-8xl mb-4">🌟</div>
                <h2 class="text-4xl font-bold mb-4 text-black">LUAR BIASA, ${playerName}!</h2>
                <h3 class="text-2xl font-semibold mb-4 text-black">🏆 Ahli Tata Negara Berprestasi!</h3>
                <p class="text-lg text-black mb-6">Pengetahuanmu tentang lembaga negara sangat mengesankan! Kamu hampir sempurna!</p>
                <div class="text-6xl mb-4">🎖️</div>
                <div class="text-black space-y-2">
                    <p class="font-semibold">📊 Pencapaian Gemilang:</p>
                    <p>✅ Jawaban Benar: ${correctCount}/10</p>
                    <p>⏱️ Waktu: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    <p>🥚 Easter Eggs: ${easterEggCount}/5</p>
                    <p class="text-green-800 font-bold">🌟 Predikat: SANGAT BAIK</p>
                </div>
            </div>
            <div class="space-y-4">
                <button onclick="restartGame()" class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300">
                    🔄 Coba Raih Skor Sempurna
                </button>
                <br>
                <button onclick="backToName()" class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
                    🏠 Menu Utama
                </button>
            </div>
        `;
    } else if (correctCount >= 7) {
        // Good Ending (7-8 benar)
        return `
            <div class="building-glow bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl p-8 mb-8">
                <div class="text-8xl mb-4">👍</div>
                <h2 class="text-4xl font-bold mb-4 text-white">BAGUS SEKALI, ${playerName}!</h2>
                <h3 class="text-2xl font-semibold mb-4 text-white">📚 Calon Ahli Tata Negara!</h3>
                <p class="text-lg text-white mb-6">Kamu sudah memahami sebagian besar tentang lembaga negara Indonesia. Terus belajar!</p>
                <div class="text-6xl mb-4">📖</div>
                <div class="text-white space-y-2">
                    <p class="font-semibold">📊 Hasil Pembelajaran:</p>
                    <p>✅ Jawaban Benar: ${correctCount}/10</p>
                    <p>⏱️ Waktu: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    <p>🥚 Easter Eggs: ${easterEggCount}/5</p>
                    <p class="text-blue-200 font-bold">📚 Predikat: BAIK</p>
                </div>
            </div>
            <div class="space-y-4">
                <button onclick="restartGame()" class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300">
                    🔄 Tingkatkan Skor
                </button>
                <br>
                <button onclick="backToName()" class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
                    🏠 Menu Utama
                </button>
            </div>
        `;
    } else if (correctCount >= 5) {
        // Average Ending (5-6 benar)
        return `
            <div class="building-glow bg-gradient-to-br from-green-400 to-teal-500 rounded-xl p-8 mb-8">
                <div class="text-8xl mb-4">🤔</div>
                <h2 class="text-4xl font-bold mb-4 text-white">CUKUP BAIK, ${playerName}!</h2>
                <h3 class="text-2xl font-semibold mb-4 text-white">🌱 Pelajar Tata Negara!</h3>
                <p class="text-lg text-white mb-6">Kamu sudah memahami dasar-dasar lembaga negara. Masih ada ruang untuk berkembang!</p>
                <div class="text-6xl mb-4">🌱</div>
                <div class="text-white space-y-2">
                    <p class="font-semibold">📊 Hasil Belajar:</p>
                    <p>✅ Jawaban Benar: ${correctCount}/10</p>
                    <p>⏱️ Waktu: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    <p>🥚 Easter Eggs: ${easterEggCount}/5</p>
                    <p class="text-green-200 font-bold">🌱 Predikat: CUKUP</p>
                </div>
            </div>
            <div class="space-y-4">
                <button onclick="restartGame()" class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300">
                    🔄 Belajar Lagi
                </button>
                <br>
                <button onclick="backToName()" class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
                    🏠 Menu Utama
                </button>
            </div>
        `;
    } else {
        // Need Improvement Ending (0-4 benar)
        return `
            <div class="building-glow bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-8 mb-8">
                <div class="text-8xl mb-4">💪</div>
                <h2 class="text-4xl font-bold mb-4 text-white">SEMANGAT, ${playerName}!</h2>
                <h3 class="text-2xl font-semibold mb-4 text-white">🔥 Pejuang Pengetahuan!</h3>
                <p class="text-lg text-white mb-6">Jangan menyerah! Setiap ahli pernah menjadi pemula. Mari belajar lebih giat lagi!</p>
                <div class="text-6xl mb-4">📚</div>
                <div class="text-white space-y-2">
                    <p class="font-semibold">📊 Awal Perjalanan:</p>
                    <p>✅ Jawaban Benar: ${correctCount}/10</p>
                    <p>⏱️ Waktu: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    <p>🥚 Easter Eggs: ${easterEggCount}/5</p>
                    <p class="text-orange-200 font-bold">💪 Predikat: PERLU BELAJAR LAGI</p>
                    <p class="text-yellow-200 text-sm mt-2">💡 Tips: Baca dialog NPC dengan teliti!</p>
                </div>
            </div>
            <div class="space-y-4">
                <button onclick="restartGame()" class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300">
                    🔄 Coba Lagi dengan Semangat!
                </button>
                <br>
                <button onclick="backToName()" class="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300">
                    🏠 Menu Utama
                </button>
            </div>
        `;
    }
}

function updateStats() {
    document.getElementById('badgeCount').textContent = completedLocations.size;
    document.getElementById('visitedCount').textContent = visitedLocations.size;
}

function restartGame() {
    visitedLocations.clear();
    completedLocations.clear();
    currentLocation = 0;
    currentDialogStep = 0;
    perfectScore = true;
    correctAnswers = 0;
    titleClickCount = 0;
    npcClickCount = 0;
    
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('secretVictoryScreen').classList.add('hidden');
    document.getElementById('mapScreen').classList.remove('hidden');
    initializeMap();
    gameStartTime = Date.now();
    startTimer();
}

function backToName() {
    stopTimer();
    visitedLocations.clear();
    completedLocations.clear();
    currentLocation = 0;
    currentDialogStep = 0;
    perfectScore = true;
    correctAnswers = 0;
    titleClickCount = 0;
    npcClickCount = 0;
    
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('secretVictoryScreen').classList.add('hidden');
    document.getElementById('leaderboardScreen').classList.add('hidden');
    document.getElementById('easterEggsScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('mapScreen').classList.add('hidden');
    document.getElementById('locationScreen').classList.add('hidden');
    
    document.getElementById('nameScreen').classList.remove('hidden', 'fade-out');
    document.getElementById('nameScreen').classList.add('fade-in');
    document.getElementById('playerName').value = '';
}

function showLeaderboard() {
    document.getElementById('nameScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('nameScreen').classList.add('hidden');
        document.getElementById('leaderboardScreen').classList.remove('hidden');
        document.getElementById('leaderboardScreen').classList.add('fade-in');
        displayLeaderboard();
    }, 500);
}

function showEasterEggs() {
    document.getElementById('nameScreen').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('nameScreen').classList.add('hidden');
        document.getElementById('easterEggsScreen').classList.remove('hidden');
        document.getElementById('easterEggsScreen').classList.add('fade-in');
        displayEasterEggs();
    }, 500);
}

function saveScore(time, correctCount) {
    const scores = JSON.parse(localStorage.getItem('pancasilaScores') || '[]');
    scores.push({
        name: playerName,
        time: time,
        correctAnswers: correctCount,
        perfect: correctCount === 10,
        date: new Date().toLocaleDateString('id-ID'),
        easterEggs: Object.values(easterEggs).filter(egg => egg.found).length
    });
    
    scores.sort((a, b) => {
        if (a.correctAnswers !== b.correctAnswers) return b.correctAnswers - a.correctAnswers;
        return a.time - b.time;
    });
    
    localStorage.setItem('pancasilaScores', JSON.stringify(scores.slice(0, 10)));
}

function loadLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('pancasilaScores') || '[]');
    return scores;
}

function displayLeaderboard() {
    const scores = loadLeaderboard();
    const content = document.getElementById('leaderboardContent');
    
    if (scores.length === 0) {
        content.innerHTML = '<p class="text-gray-400 text-center">Belum ada skor yang tercatat. Jadilah yang pertama!</p>';
        return;
    }
    
    content.innerHTML = scores.map((score, index) => {
        const minutes = Math.floor(score.time / 60);
        const seconds = score.time % 60;
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        
        // Determine grade based on correct answers
        let grade = '';
        let gradeColor = '';
        if (score.correctAnswers === 10) {
            grade = '👑 MASTER';
            gradeColor = 'text-yellow-400';
        } else if (score.correctAnswers >= 9) {
            grade = '🌟 SANGAT BAIK';
            gradeColor = 'text-orange-400';
        } else if (score.correctAnswers >= 7) {
            grade = '📚 BAIK';
            gradeColor = 'text-blue-400';
        } else if (score.correctAnswers >= 5) {
            grade = '🌱 CUKUP';
            gradeColor = 'text-green-400';
        } else {
            grade = '💪 BELAJAR LAGI';
            gradeColor = 'text-red-400';
        }
        
        return `
            <div class="flex justify-between items-center bg-white/10 rounded-lg p-4">
                <div class="flex items-center space-x-4">
                    <span class="text-2xl font-bold">${medal}</span>
                    <div>
                        <p class="font-semibold">${score.name}</p>
                        <p class="text-sm text-gray-400">${score.date}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">✅ ${score.correctAnswers}/10 - ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    <div class="flex space-x-2 text-sm">
                        <span class="${gradeColor}">${grade}</span>
                        <span class="text-purple-400">🥚 ${score.easterEggs}/5</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function unlockEasterEgg(eggId) {
    if (!easterEggs[eggId].found) {
        easterEggs[eggId].found = true;
        saveEasterEggs();
        showEasterEggNotification(easterEggs[eggId]);
    }
}

function saveEasterEggs() {
    localStorage.setItem('pancasilaEasterEggs', JSON.stringify(easterEggs));
}

function loadEasterEggs() {
    const saved = localStorage.getItem('pancasilaEasterEggs');
    if (saved) {
        const savedEggs = JSON.parse(saved);
        Object.keys(savedEggs).forEach(key => {
            if (easterEggs[key]) {
                easterEggs[key].found = savedEggs[key].found;
            }
        });
    }
}

function displayEasterEggs() {
    const content = document.getElementById('easterEggsContent');
    
    content.innerHTML = Object.entries(easterEggs).map(([key, egg]) => `
        <div class="bg-white/10 rounded-lg p-4 ${egg.found ? 'border-2 border-green-400' : 'opacity-50'}">
            <div class="text-3xl mb-2">${egg.found ? '✅' : '❓'}</div>
            <h3 class="font-semibold mb-2 ${egg.found ? 'text-green-400' : 'text-gray-400'}">${egg.name}</h3>
            <p class="text-sm ${egg.found ? 'text-white' : 'text-gray-500'}">${egg.description}</p>
            ${egg.found ? '<p class="text-xs text-green-300 mt-2">🎉 Ditemukan!</p>' : '<p class="text-xs text-gray-500 mt-2">🔒 Belum ditemukan</p>'}
        </div>
    `).join('');
}

function showEasterEggNotification(egg) {
    const notification = document.createElement('div');
    notification.className = 'easter-egg-notification';
    notification.innerHTML = `
        <div class="font-bold">🎉 Easter Egg Ditemukan!</div>
        <div class="text-sm">${egg.name}</div>
        <div class="text-xs mt-1">${egg.description}</div>
    `;
    
    document.getElementById('easterEggNotifications').appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}



