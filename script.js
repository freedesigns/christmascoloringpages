document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const loadMoreButton = document.getElementById('loadMore');
    const currentYearSpan = document.getElementById('currentYear');
    currentYearSpan.textContent = new Date().getFullYear();

    
    let imagesLoaded = 0;
    const imagesPerLoad = 9; // 3 images in 3 rows
    const emojis = ['🎄', '🎅', '❄️', '⛄', '🎁', '✨', '🦌', '🍪', '🥛', '🌟'];

    // List of image filenames
    const imageFilenames = [
        'santa-claus-christmas-coloring-pages (1).jpeg',
        'santa-claus-christmas-coloring-pages (2).jpeg',
        'santa-claus-christmas-coloring-pages (3).jpeg',
        'santa-claus-christmas-coloring-pages (4).jpeg',
        'santa-claus-christmas-coloring-pages (5).jpeg',
        'santa-claus-christmas-coloring-pages (6).jpeg',
        'santa-claus-christmas-coloring-pages (7).jpeg',
        'santa-claus-christmas-coloring-pages (8).jpeg',
        'santa-claus-christmas-coloring-pages (9).jpeg',
        'santa-claus-christmas-coloring-pages (10).jpeg',
        'merry-christmas-coloring-pages (1).jpeg',
        'merry-christmas-coloring-pages (2).jpeg',
        'merry-christmas-coloring-pages (3).jpeg',
        'merry-christmas-coloring-pages (4).jpeg',
        // Add all your image filenames here
    ];

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
        const totalImages = imageFilenames.length;
        const endIndex = Math.min(imagesLoaded + imagesPerLoad, totalImages);

        for (let i = imagesLoaded; i < endIndex; i++) {
            const imgFilename = imageFilenames[i];
            const imgSrc = `img/${imgFilename}`;

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
            img.alt = generateAltText(imgFilename);
            img.setAttribute('itemprop', 'contentUrl');
            img.loading = 'lazy';
            img.width = 1000; // Keep the original dimensions
            img.height = 1000; // Keep the original dimensions

            // Use placeholder if image not found
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/1000x1000';
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

            // Download PDF button
            const downloadPdfBtn = document.createElement('button');
            downloadPdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> PDF';
            downloadPdfBtn.onclick = () => {
                // Generate PDF from image
                generatePDF(imgSrc, imgFilename.replace('.jpeg', '.pdf'));
            };

            // Append buttons
            buttonsDiv.appendChild(downloadImgBtn);
            buttonsDiv.appendChild(downloadPdfBtn);

            // Append elements
            card.appendChild(img);
            card.appendChild(emojiDiv);
            card.appendChild(buttonsDiv);
            fragment.appendChild(card);
        }

        gallery.appendChild(fragment);
        imagesLoaded += imagesPerLoad;

        // Disable Load More button if all images are loaded
        if (imagesLoaded >= totalImages) {
            loadMoreButton.style.display = 'none';
        }
    }

    // Function to generate alt text from filename
    function generateAltText(filename) {
        return filename
            .replace(/\(\d+\)\.jpeg$/, '')
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Function to generate PDF from image
    function generatePDF(imageUrl, pdfName) {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [1000, 1000]
        });
        doc.addImage(imageUrl, 'JPEG', 0, 0, 1000, 1000);
        doc.save(pdfName);
    }

    // Include jsPDF library
    if (typeof jsPDF === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            window.jsPDF = window.jspdf.jsPDF;
        };
        document.head.appendChild(script);
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
