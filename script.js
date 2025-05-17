document.addEventListener('DOMContentLoaded', function () {
    const portfolioItems = document.querySelector('#portfolio');
    const overlay = document.querySelector('.overlay');
    const overlayContent = document.querySelector('.overlay-content');
    const body = document.body;

    const closeIcon = document.createElement('span');
    closeIcon.innerHTML = '&times;';
    closeIcon.classList.add('close-btn');
    overlay.appendChild(closeIcon);

    const projectConfig = {
        project57: { imageCount: 1, videoCount: 0, title: "Little Lion" },
        project56: { imageCount: 1, videoCount: 0, title: "Little Panther" },
        project55: { imageCount: 1, videoCount: 0, title: "Little Beast" },
        project54: { imageCount: 5, videoCount: 0, title: "Little Croc" },
        project53: { imageCount: 4, videoCount: 0, title: "Necromancer Set" },
        project52: { imageCount: 5, videoCount: 0, title: "Void Hydra Set" },
        project51: { imageCount: 5, videoCount: 0, title: "Zilla Set" },
        project50: { imageCount: 3, videoCount: 2, title: "Chasm Lurker" },
        project49: { imageCount: 13, videoCount: 4, title: "Design" },
        project48: { imageCount: 7, videoCount: 1, title: "Corrupt Sentinel" },
        project47: { imageCount: 6, videoCount: 7, title: "Low-Res Character" },
        project46: { imageCount: 6, videoCount: 1, title: "LiveTale Female" },        
        project45: { imageCount: 4, videoCount: 1, title: "Grimshot Rifle" },
        project44: { imageCount: 4, videoCount: 1, title: "SpearSphere" },
        project43: { imageCount: 2, videoCount: 1, title: "Tribal Elixir" },
        project42: { imageCount: 4, videoCount: 1, title: "Robo-Owl" },
        project41: { imageCount: 1, videoCount: 1, title: "GraveRobber" },
        project40: { imageCount: 1, videoCount: 0, title: "Chomper" },
        project39: { imageCount: 3, videoCount: 1, title: "Thunderjaw" },
        project38: { imageCount: 1, videoCount: 1, title: "ThornRoot" },
        project37: { imageCount: 3, videoCount: 1, title: "Gobbler Fish" },
        project36: { imageCount: 1, videoCount: 0, title: "Canaman Girl" },
        project35: { imageCount: 3, videoCount: 2, title: "DigiPod" },
        project34: { imageCount: 2, videoCount: 4, title: "RPS Characters" },
        project33: { imageCount: 5, videoCount: 0, title: "Skully" },
        project32: { imageCount: 6, videoCount: 1, title: "Low-Res Enemies" },
        project31: { imageCount: 6, videoCount: 0, title: "Low-Res Assets" },
        project30: { imageCount: 4, videoCount: 0, title: "Low-Res Altar" },
        project29: { imageCount: 6, videoCount: 2, title: "The Wild Robot" },
        project28: { imageCount: 3, videoCount: 4, title: "Hytale Art" },
        project27: { imageCount: 2, videoCount: 1, title: "Pekasaur" },
        project26: { imageCount: 1, videoCount: 0, title: "Beast" },
        project25: { imageCount: 2, videoCount: 0, title: "Dragon Post" },
        project24: { imageCount: 6, videoCount: 1, title: "Despicable Me 4" },
        project23: { imageCount: 1, videoCount: 1, title: "AA-12 Battlebit" },
        project22: { imageCount: 3, videoCount: 0, title: "Sonic" },
        project21: { imageCount: 3, videoCount: 0, title: "Mecha-Bot" },
        project20: { imageCount: 2, videoCount: 1, title: "BigHorn" },
        project19: { imageCount: 1, videoCount: 0, title: "Dragon Chest" },
        project18: { imageCount: 2, videoCount: 1, title: "Spike" },
        project17: { imageCount: 4, videoCount: 7, title: "DigiBitties" },
        project16: { imageCount: 3, videoCount: 0, title: "Roblox Pets" },
        project15: { imageCount: 3, videoCount: 0, title: "Roblox Fountain" },
        project14: { imageCount: 2, videoCount: 0, title: "Ogre" },
        project13: { imageCount: 4, videoCount: 0, title: "Valheim Art" },
        project12: { imageCount: 3, videoCount: 0, title: "Forest Maze" },
        project11: { imageCount: 3, videoCount: 0, title: "Viper" },
        project10: { imageCount: 3, videoCount: 3, title: "Kittens" },
        project9: { imageCount: 6, videoCount: 1, title: "Path of Percival" },
        project8: { imageCount: 4, videoCount: 3, title: "Shard of Drak" },
        project7: { imageCount: 4, videoCount: 0, title: "2D Weapons" },
        project6: { imageCount: 1, videoCount: 2, title: "Dumpster" },
        project5: { imageCount: 4, videoCount: 0, title: "Parasite" },
        project4: { imageCount: 3, videoCount: 0, title: "Sandstone Guardian" },
        project3: { imageCount: 3, videoCount: 0, title: "Dark Iron Dwarf" },
        project2: { imageCount: 4, videoCount: 0, title: "Bone King" },
        project1: { imageCount: 3, videoCount: 0, title: "Learning ZBrush" }
    };

    addPortfolioItems();

    function addPortfolioItems() {
        addProjectsToPage();
    }

    function addProjectsToPage() {
        for (const [project, config] of Object.entries(projectConfig)) {
            const projectItem = document.createElement('div');
            projectItem.classList.add('portfolio-item');
            projectItem.id = project;
            const projectName = config.title; 
            projectItem.setAttribute('data-project-name', projectName); 

            const img = document.createElement('img');
            img.src = `projects/${project}/${project}_thumbnail.png`;
            img.alt = projectName; 

            projectItem.appendChild(img);
            portfolioItems.appendChild(projectItem);

            projectItem.addEventListener('click', function (event) {
                event.stopPropagation();
                openProjectOverlay(project);
            });
        }
    }
    
    function openProjectOverlay(projectId) {
        overlayContent.innerHTML = '';
        const project = projectConfig[projectId];
        if (!project) {
            console.error(`Project ${projectId} not found in projectConfig.`);
            return;
        }

        const imagesFolder = `./projects/${projectId}/images/`;
        const videosFolder = `./projects/${projectId}/videos/`;

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');

        // Adding images if available
        if (project.imageCount) {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            for (let i = 1; i <= project.imageCount; i++) {
                const img = document.createElement('img');
                const imagePath = `${imagesFolder}image${i}.png`;

                img.onerror = function () {
                    img.remove();
                };

                img.src = imagePath;
                img.alt = `${project.title} Image ${i}`;
                imageContainer.appendChild(img);
            }

            contentContainer.appendChild(imageContainer);
        }

        // Adding videos if available
        // Adding videos or gifs if available
        if (project.videoCount) {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');
            videoContainer.style.display = 'flex';
            videoContainer.style.flexDirection = 'column';
            videoContainer.style.alignItems = 'center';
            videoContainer.style.padding = '0% 2%';

            for (let i = 1; i <= project.videoCount; i++) {
                const videoPathMp4 = `${videosFolder}video${i}.mp4`;
                const videoPathGif = `${videosFolder}video${i}.gif`;

                const img = document.createElement('img');
                img.src = videoPathGif;
                img.style.maxWidth = '100%';
                img.style.margin = '0 0 3vh';
                img.loading = 'lazy';
                img.onerror = () => {
                    // If gif doesn't load, fallback to video
                    const video = document.createElement('video');
                    video.controls = true;
                    video.style.maxWidth = '100%';
                    video.style.margin = '0 0 3vh';
                    video.volume = 0.4;

                    const source = document.createElement('source');
                    source.src = videoPathMp4;
                    video.appendChild(source);

                    videoContainer.replaceChild(video, img);
                };

                videoContainer.appendChild(img);
            }

            contentContainer.appendChild(videoContainer);
        }


        overlayContent.appendChild(contentContainer);
        overlay.style.display = 'flex';
        body.style.overflow = 'hidden';

        overlayContent.scrollTop = 0;
    }

    function closeOverlay() {
        overlay.style.display = 'none';
        body.style.overflow = 'auto';

        // Pause all videos
        const videos = overlayContent.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }

    closeIcon.addEventListener('click', closeOverlay);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeOverlay();
        }
    });

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeOverlay();
        }
    });

    document.addEventListener('click', function (event) {
        const isClickInsideOverlay = overlay.contains(event.target);
        if (!isClickInsideOverlay) {
            closeOverlay();
        }
    });

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
});

function copyToClipboard() {
    const email = document.querySelector('.contact-email').textContent.trim().replace('📋', ''); 
    const textArea = document.createElement('textarea');
    textArea.value = email;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const copiedMessage = document.createElement('div');
    copiedMessage.textContent = 'Email copied to clipboard: ' + email;
    copiedMessage.style.position = 'fixed';
    copiedMessage.style.top = '32%';
    copiedMessage.style.left = '50%';
    copiedMessage.style.transform = 'translate(-50%, -50%)';
    copiedMessage.style.padding = '10px';
    copiedMessage.style.background = '#1199ff';
    copiedMessage.style.color = '#ffffff';
    copiedMessage.style.fontWeight = 'bold';
    copiedMessage.style.borderRadius = '5px';
    copiedMessage.style.zIndex = '9999';
    document.body.appendChild(copiedMessage);

    setTimeout(function() {
        document.body.removeChild(copiedMessage);
    }, 1500); 
}

let lastParticleTime = 0;
let mouseX = 0, mouseY = 0;
let isMouseMoving = false;
let isScrolling = false;

let scrollTimeout; // To track the scroll end timeout

document.addEventListener("mousemove", (event) => {
    if (!isScrolling) {  // Only spawn particles if not scrolling
        isMouseMoving = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
        spawnParticles(mouseX, mouseY, true); // Moving = true
    }
});

document.addEventListener("scroll", () => {
    isScrolling = true; // Set flag when scrolling

    // Clear any existing timeout and set a new one
    clearTimeout(scrollTimeout);

    // Reset the isScrolling flag after scrolling has stopped for 100ms
    scrollTimeout = setTimeout(() => {
        isScrolling = false; // Reset flag after scrolling stops
    }, 100);
});

setInterval(() => {
    if (!isScrolling) {  // Only spawn particles if not scrolling
        spawnParticles(mouseX, mouseY, false); // Moving = false
    }
    isMouseMoving = false;
}, 300); // Spawns every 300ms when stationary

function spawnParticles(x, y, moving) {
    const now = Date.now();
    if (moving && now - lastParticleTime < 50) return; // Frequency control when moving
    lastParticleTime = now;

    // More particles when idle, less when moving
    const numParticles = moving ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // **25% chance of an outlined square instead of a filled particle**
        if (Math.random() < 0.25) {
            particle.classList.add("outlined");
        }

        // Adjusted spawn position (bottom-right of cursor)
        const offsetX = 6;
        const offsetY = 14;

        // Include scroll position in Y coordinate to keep particles on mouse even when scrolling
        const scrollOffsetY = window.scrollY || document.documentElement.scrollTop;

        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY + scrollOffsetY}px`;  // Add scroll offset to Y position

        // Random size variation
        const randomSize = Math.random() * 8 + 4;
        particle.style.width = `${randomSize}px`;
        particle.style.height = `${randomSize}px`;

        document.body.appendChild(particle);

        // More scattered motion when moving, tighter when stationary
        const randomX = moving ? (Math.random() - 0.5) * 50 : (Math.random() - 0.5) * 20;
        const randomY = moving ? Math.random() * 25 + 15 : Math.random() * 15 + 10;
        const randomScale = 0.3 + Math.random();
        const randomRotation = (Math.random() - 0.5) * 90; // **New rotation effect**

        setTimeout(() => {
            particle.style.opacity = "0";
            particle.style.transform = `scale(${randomScale}) translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
        }, 10);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}





