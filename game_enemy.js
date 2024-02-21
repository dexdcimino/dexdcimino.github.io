window.addEventListener('DOMContentLoaded', () => {
    const gameSquare = document.getElementById('gameSquare');
    const tryAgainImageSrc = 'gameart/try_again.png'; // Image source for "Try Again" image
    const tryAgainImageHoverSrc = 'gameart/try_again_hover.png'; // Image source for "Try Again" image on hover
    const enemySpawnIntervals = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]; // Cupcake counters to spawn enemies
    const enemyWidth = 50; // Adjust according to the actual width of the enemy image
    const enemyHeight = 50; // Adjust according to the actual height of the enemy image
    const spawnBorderDistance = 50; // Distance from the game border to spawn enemies
    const enemyAttackDistance = 50; // Distance from the player for enemy attack

    const enemyImages = {
        front: 'gameart/enemy_front.png',
        back: 'gameart/enemy_back.png',
        attack: 'gameart/enemy_attack.png'
    };

    const enemies = []; // Array to store enemy objects
    let animationPaused = false; // Flag to indicate whether animation is paused
    let audioEnabled = false; // Initially, audio is disabled

    // Create an Audio object for background music and set loop and volume
    let backgroundMusic = new Audio('gameart/background_music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    // Create an Audio object for chomp sound and set volume
    const chompSound = new Audio('gameart/chomp.mp3');
    chompSound.volume = 0.10;

    // Create an Audio object for spike impale sound and set volume
    const spikeImpaleSound = new Audio('gameart/spike_impale.mp3');
    spikeImpaleSound.volume = 0.2;

    // Load audio control image based on initial audio state
    let audioControl = document.createElement('img');
    audioControl.classList.add('audio-control');
    audioControl.src = audioEnabled ? 'gameart/audio_on.png' : 'gameart/audio_off.png';
    gameSquare.appendChild(audioControl);

    // Function to toggle audio state and update audio control image
    const toggleAudio = () => {
        audioEnabled = !audioEnabled; // Toggle the audio state
        if (audioEnabled) {
            backgroundMusic.play(); // Start playing the background music
            audioControl.src = 'gameart/audio_on.png'; // Change image to audio_on.png
        } else {
            backgroundMusic.pause(); // Pause the background music
            audioControl.src = 'gameart/audio_off.png'; // Change image to audio_off.png
        }
    };

    // Event listener for clicking on the audio control button
    audioControl.addEventListener('click', () => {
        toggleAudio();
    });

    // Function to get random enemy position
    const getRandomEnemyPosition = () => {
        const minX = spawnBorderDistance;
        const minY = spawnBorderDistance;
        const maxX = gameSquare.offsetWidth - enemyWidth - spawnBorderDistance;
        const maxY = gameSquare.offsetHeight - enemyHeight - spawnBorderDistance;
        let randomX, randomY;

        do {
            randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        } while (calculateDistance(player, {x: randomX, y: randomY}) < 250);

        return { x: randomX, y: randomY };
    };

    // Function to calculate distance between two points
    const calculateDistance = (point1, point2) => {
        const dx = point1.offsetLeft - point2.x;
        const dy = point1.offsetTop - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Function to spawn a new enemy
    const spawnEnemy = () => {
        const newEnemy = document.createElement('img');
        newEnemy.classList.add('enemy');
        newEnemy.src = enemyImages.front;
        const position = getRandomEnemyPosition();
        newEnemy.style.left = position.x + 'px';
        newEnemy.style.top = position.y + 'px';
        gameSquare.appendChild(newEnemy);

        moveEnemy(newEnemy);
    };

    // Function to move an enemy
    const moveEnemy = (enemy) => {
        const enemyObj = { element: enemy, dx: 0, dy: 0 };
        enemies.push(enemyObj);

        const animate = (timestamp) => {
            if (animationPaused) return;

            const deltaTime = (timestamp - lastFrameTime) / 1000; // Calculate delta time

            const newX = parseFloat(enemy.style.left) + enemyObj.dx * deltaTime; // Adjusted for float values
            const newY = parseFloat(enemy.style.top) + enemyObj.dy * deltaTime; // Adjusted for float values

            // Adjust direction if hitting walls
            if (newX <= 0 || newX + enemy.offsetWidth >= gameSquare.offsetWidth) {
                enemyObj.dx = -enemyObj.dx;
            }
            if (newY <= 0 || newY + enemy.offsetHeight >= gameSquare.offsetHeight) {
                enemyObj.dy = -enemyObj.dy;
            }

            enemy.style.left = newX + 'px';
            enemy.style.top = newY + 'px';
            enemy.src = enemyObj.dy < 0 ? enemyImages.back : enemyImages.front;

            const player = document.getElementById('player');
            const playerRect = player.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(playerRect.x - enemyRect.x, 2) +
                Math.pow(playerRect.y - enemyRect.y, 2)
            );

            if (distance <= enemyAttackDistance) {
                gameOver();
            }

            lastFrameTime = timestamp; // Update last frame time
            requestAnimationFrame(animate);
        };

        const directions = [-1, 1];
        enemyObj.dx = directions[Math.floor(Math.random() * 2)] * 100; // Adjust the speed as needed
        enemyObj.dy = directions[Math.floor(Math.random() * 2)] * 100; // Adjust the speed as needed

        let lastFrameTime = performance.now(); // Initialize last frame time
        requestAnimationFrame(animate);
    };

    // Event listener for keydown event
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 32) {
            if (animationPaused) {
                location.reload();
            }
        }
    });

    // Function to handle game over
    const gameOver = () => {
        console.log('Game Over!');
        animationPaused = true;

        const counter = document.getElementById('counter');
        counter.style.backgroundColor = 'transparent';
        counter.style.position = 'absolute';
        counter.style.left = '50%';
        counter.style.top = '50%';
        counter.style.transform = 'translate(-50%, -50%)';
        counter.style.fontSize = '90px';

        const changePlayerImageEvent = new Event('changePlayerImage');
        document.dispatchEvent(changePlayerImageEvent);

        for (let enemyObj of enemies) {
            enemyObj.element.src = 'gameart/enemy_attack.png';
        }

        for (let enemyObj of enemies) {
            enemyObj.dx = 0;
            enemyObj.dy = 0;
        }

        player.style.animationDuration = "0s";

        // Change player's z-index to 1
        player.style.zIndex = "1";

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        gameSquare.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('active');
        }, 50);

        const tryAgainImage = document.createElement('img');
        tryAgainImage.src = tryAgainImageSrc;
        tryAgainImage.id = 'tryAgain';
        tryAgainImage.classList.add('try-again');
        gameSquare.appendChild(tryAgainImage);

        const ggImage = document.createElement('img');
        ggImage.src = 'gameart/gg.png';
        ggImage.classList.add('gg-image');
        gameSquare.appendChild(ggImage);

        tryAgainImage.addEventListener('click', () => {
            location.reload();
        });

        tryAgainImage.addEventListener('mouseover', () => {
            tryAgainImage.src = tryAgainImageHoverSrc;
        });

        tryAgainImage.addEventListener('mouseout', () => {
            tryAgainImage.src = tryAgainImageSrc;
        });

        if (audioEnabled) {
            // Play spike impale sound when the game is over
            spikeImpaleSound.play();
        }
    };

    // Event listener for cupcakeEaten event
    document.addEventListener('cupcakeEaten', (event) => {
        const counter = event.detail.counter;

        if (enemySpawnIntervals.includes(counter)) {
            spawnEnemy();
        }

        // Increase enemy speed based on counter
        if (counter === 10 || counter === 20 || counter === 30 || counter === 40 || counter === 50) {
            increaseEnemySpeed(0.225);
        }

        // Check if audio is enabled before playing chomp sound
        if (audioEnabled) {
            // Play chomp sound when an enemy eats a cupcake
            chompSound.play();
        }
    });

    // Function to increase enemy speed
    const increaseEnemySpeed = (percentage) => {
        for (let enemyObj of enemies) {
            enemyObj.dx *= (1 + percentage);
            enemyObj.dy *= (1 + percentage);
        }
    };
});
