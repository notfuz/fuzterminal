import photos from "./galleryData.js";

const overlay = document.getElementById("gallery-overlay");
const content = document.getElementById("gallery-content");

overlay.addEventListener("click", (e) => {

    if (e.target === overlay) {

        closeGallery();

    }

});

export function openGallery(){

    content.innerHTML = "";

    for(const photo of photos){

        const card = document.createElement("div");

        card.className = "gallery-item";

card.innerHTML = `
    <img class="gallery-image" src="${photo.image}">
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

        content.appendChild(card);
const img = card.querySelector(".gallery-image");

img.addEventListener("click", () => {

    document.getElementById("lightbox-image").src = photo.image;

    document.getElementById("lightbox").style.display = "flex";

});
    }

    overlay.style.display = "flex";

}

export function closeGallery(){

    overlay.style.display = "none";

}

const lightbox = document.getElementById("lightbox");

document.getElementById("lightbox-close").addEventListener("click", () => {

    lightbox.style.display = "none";

});

lightbox.addEventListener("click", e => {

    if(e.target === lightbox){

        lightbox.style.display = "none";

    }

});