window.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const cupcake = document.getElementById('cupcake');
    const gameSquare = document.getElementById('gameSquare');
    const counterElement = document.getElementById('counter');
    
    let counter = 0;
    let eatCupcakeTimeout;
    let lastFrameTime = performance.now();
    let deltaTime = 0;

    let playerX = gameSquare.offsetWidth / 2 - player.offsetWidth / 2;
    let playerY = gameSquare.offsetHeight / 2 - player.offsetHeight / 2;

    let dx = 0;
    let dy = 0;

    const keysPressed = {};
    const playerSpeed = 350;

    const playerShadow = document.createElement('img');
    playerShadow.src = "gameart/player_shadow.png";
    playerShadow.classList.add('player-shadow');
    gameSquare.appendChild(playerShadow);

    const cupcakeShadow = document.createElement('img');
    cupcakeShadow.src = "gameart/cupcake_shadow.png";
    cupcakeShadow.classList.add('cupcake-shadow');
    gameSquare.appendChild(cupcakeShadow);

    const updatePlayerPosition = () => {
        const now = performance.now();
        deltaTime = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        const moveX = dx * playerSpeed * deltaTime;
        const moveY = dy * playerSpeed * deltaTime;

        playerX += moveX;
        playerY += moveY;

        playerX = Math.max(0, Math.min(playerX, gameSquare.offsetWidth - player.offsetWidth));
        playerY = Math.max(0, Math.min(playerY, gameSquare.offsetHeight - player.offsetHeight));

        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';

        playerShadow.style.left = (playerX - 3) + 'px';
        playerShadow.style.top = (playerY + 70) + 'px';
    };

    const updateCupcakePosition = () => {
        cupcakeShadow.style.left = cupcake.style.left;
        cupcakeShadow.style.top = (parseInt(cupcake.style.top) + 50) + 'px';
    };

    const updatePlayerImage = () => {
        const imagePath = "gameart/";
        if (!eatingCupcake) {
            if (dy < 0) {
                player.src = imagePath + "player_back.png";
            } else if (dy > 0) {
                player.src = imagePath + "player_front.png";
            } else if (dx < 0) {
                player.src = imagePath + "player_left.png";
            } else if (dx > 0) {
                player.src = imagePath + "player_right.png";
            }

            if (dx !== 0 || dy !== 0) {
                player.style.animationDuration = "0.75s";
            } else {
                player.style.animationDuration = "1.5s";
            }
        }
    };

    let eatingCupcake = false;

    const eatCupcake = () => {
        try {
            const distance = calculateDistance(player, cupcake);
            if (distance <= 30) {
                clearTimeout(eatCupcakeTimeout);

                console.log("Yummy! You ate the cupcake!");
                counter++;
                counterElement.textContent = counter;

                // Dispatch cupcakeEaten event
                const cupcakeEatenEvent = new CustomEvent('cupcakeEaten', { detail: { counter: counter } });
                document.dispatchEvent(cupcakeEatenEvent);

                eatingCupcake = true;
                const originalSrc = player.src;
                player.src = "gameart/player_eat.png";

                eatCupcakeTimeout = setTimeout(() => {
                    eatingCupcake = false;
                    player.src = originalSrc;
                }, 250);

                respawnCupcake();
            }
        } catch (error) {
            console.error('An error occurred while eating the cupcake:', error);
        }
    };

    const calculateDistance = (element1, element2) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
        const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    };

    const respawnCupcake = () => {
        let attempts = 0;
        let newPosition = getRandomPosition();
        while (calculateDistance(gameSquare, cupcake) <= 30) {
            attempts++;
            if (attempts > 100) {
                console.error("Failed to respawn cupcake after 100 attempts.");
                break;
            }
            newPosition = getRandomPosition();
        }
        cupcake.style.left = newPosition.x + 'px';
        cupcake.style.top = newPosition.y + 'px';
    };

    const getRandomPosition = () => {
        const minX = 40;
        const minY = 40;
        const maxX = gameSquare.offsetWidth - cupcake.offsetWidth - 40;
        const maxY = gameSquare.offsetHeight - cupcake.offsetHeight - 40;
        const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        return { x: randomX, y: randomY };
    };

    document.addEventListener('keydown', (event) => {
        if (!document.getElementById('tryAgain')) {
            const key = event.key.toLowerCase();
            keysPressed[key] = true;
            updateVelocity();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (!document.getElementById('tryAgain')) {
            const key = event.key.toLowerCase();
            delete keysPressed[key];
            updateVelocity();
        }
    });

    document.addEventListener('disablePlayerMovement', () => {
        dx = 0;
        dy = 0;
    });

    document.addEventListener('changePlayerImage', () => {
        player.src = "gameart/player_death.png";
        player.style.top = (parseInt(player.style.top) + 40) + 'px';
    });

    const updateVelocity = () => {
        dx = 0;
        dy = 0;
        if (keysPressed['w'] || keysPressed['arrowup']) dy -= 1;
        if (keysPressed['s'] || keysPressed['arrowdown']) dy += 1;
        if (keysPressed['a'] || keysPressed['arrowleft']) dx -= 1;
        if (keysPressed['d'] || keysPressed['arrowright']) dx += 1;
    };

    const update = () => {
        if (!document.getElementById('tryAgain')) {
            updatePlayerPosition();
            updatePlayerImage();
            eatCupcake();
            updateCupcakePosition();
            requestAnimationFrame(update);
        }
    };
    update();

    const initialPosition = getRandomPosition();
    cupcake.style.left = initialPosition.x + 'px';
    cupcake.style.top = initialPosition.y + 'px';
});