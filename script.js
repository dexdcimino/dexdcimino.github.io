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
        project35: { count: 1, title: "Beast" },
        project34: { count: 3, title: "Viper" },
        project33: { count: 6, title: "Low-Res Character" },
        project32: { count: 6, title: "Low-Res Enemies" },
        project31: { count: 6, title: "Low-Res Assets" },
        project30: { count: 4, title: "Low-Res Altar" },
        project29: { count: 1, title: "Canaman Girl" },
        project28: { count: 3, title: "Hytale Fan Art" },
        project27: { count: 2, title: "Pekasaur" },
        project26: { count: 2, title: "ThornRoot" },
        project25: { count: 2, title: "Dragon Post" },
        project24: { count: 2, title: "GraveRobber" },
        project23: { count: 1, title: "AA-12 Battlebit" },
        project22: { count: 5, title: "Skully" },
        project21: { count: 3, title: "Mecha-Bot" },
        project20: { count: 3, title: "DigiPod" },
        project19: { count: 4, title: "DigiBitties" },
        project18: { count: 2, title: "Spike" },
        project17: { count: 3, title: "Worm" },
        project16: { count: 3, title: "Roblox Pets" },
        project15: { count: 3, title: "Roblox Fountain" },
        project14: { count: 2, title: "Ogre" },
        project13: { count: 4, title: "Valheim Fan Art" },
        project12: { count: 3, title: "Forest Maze" },
        project11: { count: 3, title: "RPS Characters" },
        project10: { count: 3, title: "Kittens" },
        project9: { count: 6, title: "Path of Percival" },
        project8: { count: 4, title: "Shard of Drak" },
        project7: { count: 4, title: "2D Weapons" },
        project6: { count: 1, title: "Dumpster" },
        project5: { count: 4, title: "Parasite" },
        project4: { count: 3, title: "Sandstone Guardian" },
        project3: { count: 3, title: "Dark Iron Dwarf" },
        project2: { count: 4, title: "Bone King" },
        project1: { count: 3, title: "Learning ZBrush" }
    };

    const reelConfig = {
        reel20: { count: 6, title: "Player Animations" },
        reel19: { count: 1, title: "Player Turntable" },
        reel18: { count: 1, title: "Evil Eye" },
        reel17: { count: 1, title: "Ghost Scythe" },
        reel16: { count: 1, title: "ThornRoot" },
        reel15: { count: 1, title: "Pekasaur" },
        reel14: { count: 1, title: "AA-12" },
        reel13: { count: 4, title: "Hytale" },
        reel12: { count: 1, title: "GraveRobber" },
        reel11: { count: 1, title: "White Knight" },
        reel10: { count: 2, title: "DigiPod" },
        reel9: { count: 5, title: "DigiBittie Enemies" },
        reel8: { count: 6, title: "DigiBitties" },
        reel7: { count: 1, title: "Bruiser" },
        reel6: { count: 2, title: "Chest" },
        reel5: { count: 3, title: "Kittens" },
        reel4: { count: 1, title: "Cannon Tower" },
        reel3: { count: 4, title: "RPS Characters" },
        reel2: { count: 3, title: "Shard of Drak" },
        reel1: { count: 2, title: "Dumpster" }
    };

    addPortfolioItems();

    function addPortfolioItems() {
        const isReelsPage = window.location.pathname.includes('reels.html');

        if (isReelsPage) {
            addReelsToPage();
        } else {
            addProjectsToPage();
        }
    }

    function addProjectsToPage() {
        for (const [project, config] of Object.entries(projectConfig)) {
            const projectItem = document.createElement('div');
            projectItem.classList.add('portfolio-item');
            projectItem.id = project;
            const projectName = config.title; // Get custom title from config
            projectItem.setAttribute('data-project-name', projectName); // Set custom title as attribute

            const img = document.createElement('img');
            img.src = `projects/${project}/${project}_thumbnail.png`;
            img.alt = projectName; // Use custom title as alt text

            projectItem.appendChild(img);
            portfolioItems.appendChild(projectItem);

            projectItem.addEventListener('click', function (event) {
                event.stopPropagation();
                openProjectOverlay(project);
            });
        }
    }

    function addReelsToPage() {
        for (const [reel, config] of Object.entries(reelConfig)) {
            const reelItem = document.createElement('div');
            reelItem.classList.add('portfolio-item');
            reelItem.id = reel;

            const reelName = config.title; // Get custom title from config
            reelItem.setAttribute('data-project-name', reelName); // Set custom title as attribute

            const img = document.createElement('img');
            img.src = `reels/${reel}/${reel}_thumbnail.png`;
            img.alt = reelName; // Use custom title as alt text

            reelItem.appendChild(img);
            portfolioItems.appendChild(reelItem);

            reelItem.addEventListener('click', function (event) {
                event.stopPropagation();
                openReelOverlay(reel, config.count);
            });
        }
    }
    function openProjectOverlay(projectId) {
        overlayContent.innerHTML = '';
        const imagesFolder = `./projects/${projectId}/images/`;
        const numberOfImages = projectConfig[projectId].count || 3; // Access count from projectConfig

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        for (let i = 1; i <= numberOfImages; i++) {
            const img = document.createElement('img');
            const imagePath = `${imagesFolder}image${i}.png`;

            img.onerror = function () {
                img.remove();
            };

            img.src = imagePath;
            img.alt = projectConfig[projectId].title + ` Image ${i}`; // Access title from projectConfig
            imageContainer.appendChild(img);
        }

        overlayContent.appendChild(imageContainer);
        overlay.style.display = 'flex';
        body.style.overflow = 'hidden';

        overlayContent.scrollTop = 0;
    }

    function openReelOverlay(reelId, numberOfVideos) {
        overlayContent.innerHTML = '';
        const videosFolder = `./reels/${reelId}/videos/`;

        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');
        videoContainer.style.display = 'flex';
        videoContainer.style.flexDirection = 'column'; // Align videos vertically
        videoContainer.style.alignItems = 'center'; // Center items horizontally

        for (let i = 1; i <= numberOfVideos; i++) {
            const video = document.createElement('video');
            video.controls = true;
            video.style.maxWidth = '95%'; // Set maximum width for the video
            video.style.margin = '20px'; // Add bottom margin for spacing

            // Set default volume to 40%
            video.volume = 0.4;

            const source = document.createElement('source');
            source.src = `${videosFolder}video${i}.mp4`;
            video.appendChild(source);

            videoContainer.appendChild(video);
        }

        overlayContent.appendChild(videoContainer);
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
