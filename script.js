let phoneInput = document.getElementById('phoneInput');
let startButton = document.getElementById('startButton');
let errorMsg = document.getElementById('errorMsg');

let loginContainer = document.getElementById('login-container');
let gameContainer = document.getElementById('game-container');
let gameArea = document.getElementById('game-area');
let scoreDisplay = document.getElementById('score');
let timeDisplay = document.getElementById('time');

let resultContainer = document.getElementById('result-container');
let finalScoreDisplay = document.getElementById('finalScore');
let rewardMessage = document.getElementById('reward-message');
let topPlayersList = document.getElementById('topPlayers');

let score = 0;
let timer;
let gameTime = 45;
let currentPhone = '';
let playCounts = {};  // In production, replace with Google Sheets tracking
let hasCaughtGold = false;

// Sound effects
let catchSound = new Audio('assets/catch.mp3');
let rewardSound = new Audio('assets/reward.mp3');

startButton.addEventListener('click', () => {
  const phone = phoneInput.value.trim();
  if (!phone || phone.length < 9) {
    errorMsg.textContent = "Vui lòng nhập số điện thoại hợp lệ.";
    return;
  }

  if (!playCounts[phone]) playCounts[phone] = 0;

  if (playCounts[phone] >= 2) {
    errorMsg.textContent = "Bạn đã hết lượt chơi!";
    return;
  }

  currentPhone = phone;
  playCounts[phone]++;
  startGame();
});

function startGame() {
  loginContainer.style.display = 'none';
  gameContainer.style.display = 'block';
  score = 0;
  hasCaughtGold = false;
  gameTime = 45;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = gameTime;

  timer = setInterval(() => {
    gameTime--;
    timeDisplay.textContent = gameTime;
    if (gameTime <= 0) endGame();
  }, 1000);

  spawnCroissants();
}

function spawnCroissants() {
  const spawnInterval = setInterval(() => {
    if (gameTime <= 0) {
      clearInterval(spawnInterval);
      return;
    }

    const isGold = Math.random() < 0.1;
    const croissant = document.createElement('img');
    croissant.src = isGold ? 'assets/gold-croissant.png' : 'assets/croissant.png';
    croissant.className = 'croissant';
    if (isGold) croissant.classList.add('gold');

    const x = Math.random() * (gameArea.offsetWidth - 60);
    const y = Math.random() * (gameArea.offsetHeight - 60);
    croissant.style.left = `${x}px`;
    croissant.style.top = `${y}px`;

    croissant.addEventListener('click', () => {
      score += isGold ? 20 : 5;
      scoreDisplay.textContent = score;
      gameArea.removeChild(croissant);
      catchSound.play();
      if (isGold) {
        hasCaughtGold = true;
        rewardSound.play();
      }
    });

    gameArea.appendChild(croissant);

    setTimeout(() => {
      if (gameArea.contains(croissant)) {
        gameArea.removeChild(croissant);
      }
    }, 1500);

  }, 800);
}

function endGame() {
  clearInterval(timer);
  gameContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  finalScoreDisplay.textContent = score;

  showReward();
  showLeaderboard();

  // TODO: Send result to Google Sheets (if needed)
}

function showReward() {
  let message = "";

  if (score >= 300) {
    message += "🎉 Giảm 10% hóa đơn từ 150k trở lên<br>";
  }
  if (score >= 350) {
    message += "🥤 Tặng 1 ly Cà phê muối hoặc Matcha Latte miễn phí<br>";
  }
  if (isTop1()) {
    message += "🏅 Huy hiệu “Thợ săn Croissant” + vinh danh trên fanpage<br>";
  }
  if (hasCaughtGold) {
    message += "🎁 Quà bất ngờ (phiếu giảm giá, topping free,...)<br>";
  }

  message += "<br><strong>Quét mã QR để nhận quà!</strong>";
  rewardMessage.innerHTML = message;
}

function showLeaderboard() {
  // Fake leaderboard data (replace with Google Sheets data fetch)
  const leaderboard = [
    { phone: '039*****12', score: 400 },
    { phone: '097*****56', score: 350 },
    { phone: '091*****88', score: 320 },
    { phone: '085*****33', score: 310 },
    { phone: '038*****99', score: 305 },
  ];

  topPlayersList.innerHTML = '';
  leaderboard.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1} - ${player.phone}: ${player.score} điểm`;
    topPlayersList.appendChild(li);
  });
}

function isTop1() {
  // Fake check (replace with real Top 1 condition)
  return score >= 400;
}

function restartGame() {
  resultContainer.style.display = 'none';
  loginContainer.style.display = 'block';
}
