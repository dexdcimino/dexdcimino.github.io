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
        project39: { imageCount: 6, videoCount: 1, title: "LiveTale Female" },
        project38: { imageCount: 2, videoCount: 1, title: "Tribal Elixir" },
        project37: { imageCount: 3, videoCount: 1, title: "Gobbler Fish" },
        project36: { imageCount: 4, videoCount: 1, title: "Robo-Owl" },
        project35: { imageCount: 1, videoCount: 0, title: "Beast" },
        project34: { imageCount: 3, videoCount: 0, title: "Viper" },
        project33: { imageCount: 6, videoCount: 7, title: "Low-Res Character" },
        project32: { imageCount: 6, videoCount: 1, title: "Low-Res Enemies" },
        project31: { imageCount: 6, videoCount: 0, title: "Low-Res Assets" },
        project30: { imageCount: 4, videoCount: 0, title: "Low-Res Altar" },
        project29: { imageCount: 1, videoCount: 0, title: "Canaman Girl" },
        project28: { imageCount: 3, videoCount: 4, title: "Hytale Fan Art" },
        project27: { imageCount: 2, videoCount: 1, title: "Pekasaur" },
        project26: { imageCount: 2, videoCount: 3, title: "ThornRoot" },
        project25: { imageCount: 2, videoCount: 0, title: "Dragon Post" },
        project24: { imageCount: 2, videoCount: 2, title: "GraveRobber" },
        project23: { imageCount: 1, videoCount: 1, title: "AA-12 Battlebit" },
        project22: { imageCount: 5, videoCount: 0, title: "Skully" },
        project21: { imageCount: 3, videoCount: 0, title: "Mecha-Bot" },
        project20: { imageCount: 3, videoCount: 2, title: "DigiPod" },
        project19: { imageCount: 4, videoCount: 7, title: "DigiBitties" },
        project18: { imageCount: 2, videoCount: 1, title: "Spike" },
        project17: { imageCount: 3, videoCount: 0, title: "Worm" },
        project16: { imageCount: 3, videoCount: 0, title: "Roblox Pets" },
        project15: { imageCount: 3, videoCount: 0, title: "Roblox Fountain" },
        project14: { imageCount: 2, videoCount: 0, title: "Ogre" },
        project13: { imageCount: 4, videoCount: 0, title: "Valheim Fan Art" },
        project12: { imageCount: 3, videoCount: 0, title: "Forest Maze" },
        project11: { imageCount: 3, videoCount: 4, title: "RPS Characters" },
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
        if (project.videoCount) {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');
            videoContainer.style.display = 'flex';
            videoContainer.style.flexDirection = 'column';
            videoContainer.style.alignItems = 'center';
            videoContainer.style.padding = '0% 2%';

            for (let i = 1; i <= project.videoCount; i++) {
                const video = document.createElement('video');
                video.controls = true;
                video.style.maxWidth = '100%';
                video.style.margin = '0 0 3vh';
                video.volume = 0.4;

                const source = document.createElement('source');
                source.src = `${videosFolder}video${i}.mp4`;
                video.appendChild(source);

                videoContainer.appendChild(video);
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