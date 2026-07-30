import photos from "./galleryData.js";

const overlay = document.getElementById("gallery-overlay");
const content = document.getElementById("gallery-content");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");

let currentIndex = 0;

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

    lightboxImage.style.transform =
        `translate(calc(-50% + ${camera.x}px), calc(-50% + ${camera.y}px)) scale(${camera.scale})`;

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

export function openGallery(){

    content.innerHTML = "";

    photos.forEach((photo,index)=>{

        const card = document.createElement("div");

        card.className = "gallery-item";

        card.innerHTML = `
            <img class="gallery-image" src="${photo.image}" draggable="false">

            <div class="gallery-info">

                <h2>${photo.title}</h2>

                <div class="gallery-date">
                    ${photo.date}
                </div>

                <div class="gallery-description">
                    ${photo.description}
                </div>

            </div>
        `;

        card.querySelector("img").addEventListener("click",()=>{

            openLightbox(index);

        });

        content.appendChild(card);

    });

    overlay.style.display = "flex";

}

export function closeGallery(){

    overlay.style.display = "none";

}

function openLightbox(index){

    currentIndex = index;

    const photo = photos[index];

    lightboxImage.src = photo.image;

    lightboxImage.draggable = false;

    lightboxImage.onload = ()=>{

        resetCamera();

    };

    lightboxCaption.innerHTML = `
        <strong>${photo.title}</strong><br>
        ${photo.description}
    `;

    lightboxCounter.textContent =
        `${index+1} / ${photos.length}`;

    lightbox.style.display = "flex";

}

function nextImage(){

    currentIndex++;

    if(currentIndex >= photos.length)
        currentIndex = 0;

    openLightbox(currentIndex);

}

function previousImage(){

    currentIndex--;

    if(currentIndex < 0)
        currentIndex = photos.length-1;

    openLightbox(currentIndex);

}

// Prevent the browser from dragging the image
lightboxImage.addEventListener("dragstart", e => {

    e.preventDefault();

});

lightboxImage.addEventListener("mousedown", e => {

    if (camera.scale <= 1)
        return;

    e.preventDefault();

    camera.dragging = true;

    camera.lastMouseX = e.clientX;
    camera.lastMouseY = e.clientY;

    lightboxImage.style.cursor = "grabbing";

});

window.addEventListener("mouseup", () => {

    camera.dragging = false;

    lightboxImage.style.cursor =
        camera.scale > 1 ? "grab" : "default";

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

    const rect = lightboxImage.getBoundingClientRect();

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

        lightboxImage.style.cursor = "default";

        return;

    }

    lightboxImage.style.cursor = "grab";

    render();

}, { passive:false });

lightboxImage.addEventListener("dblclick", e => {

    e.preventDefault();

    if (camera.scale === 1) {

        camera.scale = 2.5;

    } else {

        resetCamera();

    }

    render();

});

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

lightboxImage.setAttribute("draggable", "false");

lightboxImage.addEventListener("dragstart", e => {

    e.preventDefault();

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

lightboxImage.addEventListener("mouseenter", () => {

    lightboxImage.style.cursor =
        camera.scale > 1 ? "grab" : "zoom-in";

});

lightboxImage.addEventListener("mouseleave", () => {

    if (!camera.dragging)
        lightboxImage.style.cursor = "default";

});

function preload(index){

    const img = new Image();

    img.src = photos[index].image;

}

const oldOpenLightbox = openLightbox;

openLightbox = function(index){

    oldOpenLightbox(index);

    preload((index + 1) % photos.length);

    preload(
        (index - 1 + photos.length) %
        photos.length
    );

};