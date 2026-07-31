import loadAlbums from "./galleryData.js";

const overlay = document.getElementById("gallery-overlay");
const content = document.getElementById("gallery-content");

const lightbox = document.getElementById("lightbox");
const lightboxViewport = document.getElementById("lightbox-viewport");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");

let albums = [];
let currentItems = [];
let currentIndex = 0;
let lightboxMedia = document.getElementById("lightbox-image");

const camera = {

    x: 0,
    y: 0,

    scale: 1,

    minScale: 1,
    maxScale: 6,

    dragging: false,

    lastMouseX: 0,
    lastMouseY: 0

};

function render(){

    if (lightboxMedia) {
        lightboxMedia.style.transform =
            `translate(calc(-50% + ${camera.x}px), calc(-50% + ${camera.y}px)) scale(${camera.scale})`;
    }

}

function resetCamera(){

    camera.x = 0;
    camera.y = 0;

    camera.scale = 1;

    render();

}

overlay.addEventListener("click", e=>{

    if(e.target === overlay){

        closeGallery();

    }

});

export async function openGallery(){

    content.innerHTML = "";

    try {

        albums = await loadAlbums();

    } catch (error) {

        console.error(error);
        content.innerHTML = "<div class='gallery-empty'>Unable to load albums.</div>";
        overlay.style.display = "flex";
        return;

    }

    if (!albums.length) {

        content.innerHTML = "<div class='gallery-empty'>No albums found.</div>";
        overlay.style.display = "flex";
        return;

    }

    albums.forEach((album, albumIndex) => {

        const card = document.createElement("div");
        card.className = "gallery-item";

        const previewItems = (album.items || []).slice(0, 4);
        const previewMarkup = previewItems.map((item, index) => {
            const isVideo = item.type === "video";
            return `
                <div class="gallery-preview-tile" data-index="${index}">
                    ${isVideo
                        ? `<video class="gallery-preview-media" src="${item.src}" muted playsinline preload="metadata"></video>`
                        : `<img class="gallery-preview-media" src="${item.src}" draggable="false">`}
                </div>
            `;
        }).join("");

        card.innerHTML = `
            <div class="gallery-preview-grid">${previewMarkup}</div>

            <div class="gallery-info">

                <h2>${album.title}</h2>

                <div class="gallery-date">
                    ${album.date || "Album"}
                </div>

                <div class="gallery-description">
                    ${album.items?.length ? `${album.items.length} item${album.items.length === 1 ? "" : "s"}` : "No media yet"}
                </div>

            </div>
        `;

        card.querySelectorAll(".gallery-preview-tile").forEach(tile => {
            tile.addEventListener("click", () => {
                openLightbox(albumIndex, Number(tile.dataset.index));
            });
        });

        content.appendChild(card);

    });

    overlay.style.display = "flex";

}

export function closeGallery(){

    overlay.style.display = "none";

}

function openLightbox(albumIndex, itemIndex){

    currentIndex = itemIndex;
    currentItems = albums[albumIndex]?.items || [];

    if (!currentItems.length) return;

    renderLightboxItem(currentItems[currentIndex], albumIndex);

    lightbox.style.display = "flex";

}

function renderLightboxItem(item, albumIndex){

    const album = albums[albumIndex];

    if (!item) return;

    if (lightboxMedia) {
        lightboxMedia.remove();
    }

    const mediaElement = item.type === "video"
        ? document.createElement("video")
        : document.createElement("img");

    mediaElement.id = "lightbox-image";
    mediaElement.className = "lightbox-media";
    mediaElement.draggable = false;
    mediaElement.src = item.src;

    if (item.type === "video") {
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.playsinline = true;
        mediaElement.muted = false;
    }

    lightboxViewport.appendChild(mediaElement);
    lightboxMedia = mediaElement;

    attachMediaEvents(mediaElement);

    if (item.type === "image") {
        mediaElement.onload = () => {
            resetCamera();
        };
    } else {
        resetCamera();
    }

    const captionParts = [];
    if (item.name) captionParts.push(item.name);
    if (item.description) captionParts.push(item.description);
    if (item.date) captionParts.push(item.date);

    lightboxCaption.innerHTML = `
        <strong>${album.title}</strong><br>
        ${captionParts.join(" • ") || item.name || album.title}
    `;

    lightboxCounter.textContent =
        `${currentIndex + 1} / ${currentItems.length}`;

}

function nextImage(){

    if (!currentItems.length) return;

    currentIndex++;

    if(currentIndex >= currentItems.length)
        currentIndex = 0;

    const activeAlbum = albums.findIndex(album => album.items?.length && album.items.some(item => item.src === currentItems[currentIndex]?.src));
    renderLightboxItem(currentItems[currentIndex], activeAlbum >= 0 ? activeAlbum : 0);

}

function previousImage(){

    if (!currentItems.length) return;

    currentIndex--;

    if(currentIndex < 0)
        currentIndex = currentItems.length-1;

    const activeAlbum = albums.findIndex(album => album.items?.length && album.items.some(item => item.src === currentItems[currentIndex]?.src));
    renderLightboxItem(currentItems[currentIndex], activeAlbum >= 0 ? activeAlbum : 0);

}

function attachMediaEvents(mediaElement){

    mediaElement.addEventListener("dragstart", e => {
        e.preventDefault();
    });

    mediaElement.addEventListener("mousedown", e => {

        if (camera.scale <= 1)
            return;

        e.preventDefault();

        camera.dragging = true;

        camera.lastMouseX = e.clientX;
        camera.lastMouseY = e.clientY;

        mediaElement.style.cursor = "grabbing";

    });

    mediaElement.addEventListener("dblclick", e => {

        e.preventDefault();

        if (camera.scale === 1) {
            camera.scale = 2.5;
        } else {
            resetCamera();
        }

        render();

    });

    mediaElement.addEventListener("mouseenter", () => {
        mediaElement.style.cursor = camera.scale > 1 ? "grab" : "zoom-in";
    });

    mediaElement.addEventListener("mouseleave", () => {
        if (!camera.dragging) {
            mediaElement.style.cursor = "default";
        }
    });

}

window.addEventListener("mouseup", () => {

    camera.dragging = false;

    if (lightboxMedia) {
        lightboxMedia.style.cursor =
            camera.scale > 1 ? "grab" : "default";
    }

});

window.addEventListener("mousemove", e => {

    if (!camera.dragging)
        return;

    camera.x += e.clientX - camera.lastMouseX;
    camera.y += e.clientY - camera.lastMouseY;

    camera.lastMouseX = e.clientX;
    camera.lastMouseY = e.clientY;

    render();

});

lightbox.addEventListener("wheel", e => {

    if (lightbox.style.display !== "flex")
        return;

    e.preventDefault();

    if (!lightboxMedia) return;

    const rect = lightboxMedia.getBoundingClientRect();

    // Mouse position relative to image center
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;

    const oldScale = camera.scale;

    if (e.deltaY < 0)
        camera.scale *= 1.15;
    else
        camera.scale /= 1.15;

    camera.scale = Math.max(
        camera.minScale,
        Math.min(camera.maxScale, camera.scale)
    );

    const ratio = camera.scale / oldScale;

    camera.x -= mx * (ratio - 1);
    camera.y -= my * (ratio - 1);

    if (camera.scale <= 1.01) {

        resetCamera();

        lightboxMedia.style.cursor = "default";

        return;

    }

    lightboxMedia.style.cursor = "grab";

    render();

}, { passive:false });

document.addEventListener("keydown", e => {

    if (lightbox.style.display !== "flex")
        return;

    switch (e.key) {

        case "ArrowLeft":
            previousImage();
            break;

        case "ArrowRight":
            nextImage();
            break;

        case "Escape":
            lightbox.style.display = "none";
            break;

    }

});

lightboxPrev.addEventListener("click", previousImage);

lightboxNext.addEventListener("click", nextImage);

lightboxClose.addEventListener("click", () => {

    lightbox.style.display = "none";

});

lightbox.addEventListener("click", e => {

    if (e.target === lightbox) {

        lightbox.style.display = "none";

    }

});

let touchDistance = 0;

lightbox.addEventListener("touchstart", e => {

    if (e.touches.length === 2) {

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;

        touchDistance = Math.hypot(dx, dy);

    }

}, { passive: false });

lightbox.addEventListener("touchmove", e => {

    if (e.touches.length !== 2)
        return;

    e.preventDefault();

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;

    const distance = Math.hypot(dx, dy);

    camera.scale *= distance / touchDistance;

    camera.scale = Math.max(
        camera.minScale,
        Math.min(camera.maxScale, camera.scale)
    );

    touchDistance = distance;

    render();

}, { passive: false });

function preload(index){

    if (!currentItems[index]) return;

    if (currentItems[index].type === "image") {
        const img = new Image();
        img.src = currentItems[index].src;
    }

}

const oldOpenLightbox = openLightbox;

openLightbox = function(albumIndex, itemIndex){

    oldOpenLightbox(albumIndex, itemIndex);

    preload((itemIndex + 1) % currentItems.length);
    preload((itemIndex - 1 + currentItems.length) % currentItems.length);

};