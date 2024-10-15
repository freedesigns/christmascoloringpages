// Optimize script execution using async functions and requestIdleCallback
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const loadMoreButton = document.getElementById('loadMore');
    const currentYearSpan = document.getElementById('currentYear');
    currentYearSpan.textContent = new Date().getFullYear();

    let imagesLoaded = 0;
    const imagesPerLoad = 9; // 3 images in 3 rows
    const emojis = ['🎄', '🎅', '❄️', '⛄', '🎁', '✨', '🦌', '🍪', '🥛', '🌟'];

    // Preload images for better performance
    function preloadImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve;
        });
    }

    // Function to load images
    async function loadImages() {
        const fragment = document.createDocumentFragment();

        for (let i = imagesLoaded + 1; i <= imagesLoaded + imagesPerLoad; i++) {
            let imgName = `merry-christmas-coloring-pages${i}`;
            let imgSrc = `images/${imgName}.jpg`;

            // Preload image
            await preloadImage(imgSrc);

            // Create card element
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('itemscope', '');
            card.setAttribute('itemtype', 'https://schema.org/ImageObject');

            // Create image element
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = imgName.replace(/-\d+$/, '').replace(/-/g, ' ');
            img.setAttribute('itemprop', 'contentUrl');
            img.loading = 'lazy';

            // Use placeholder if image not found
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/1000';
            };

            // Create emoji overlay
            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'emoji';
            emojiDiv.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Create buttons container
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttons';

            // Download Image button
            const downloadImgBtn = document.createElement('button');
            downloadImgBtn.innerHTML = '<i class="fas fa-download"></i> Image';
            downloadImgBtn.onclick = () => {
                window.open(imgSrc, '_blank');
            };

            // Append elements
            buttonsDiv.appendChild(downloadImgBtn);
            card.appendChild(img);
            card.appendChild(emojiDiv);
            card.appendChild(buttonsDiv);
            fragment.appendChild(card);
        }

        gallery.appendChild(fragment);
        imagesLoaded += imagesPerLoad;
    }

    // Initial load with requestIdleCallback for better INP
    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadImages);
    } else {
        setTimeout(loadImages, 1);
    }

    // Load more images on button click
    loadMoreButton.addEventListener('click', () => {
        loadMoreButton.disabled = true;
        loadImages().then(() => {
            loadMoreButton.disabled = false;
        });
    });
});
