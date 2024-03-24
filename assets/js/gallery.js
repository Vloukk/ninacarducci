// Attend que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne toutes les images de la galerie
    const images = document.querySelectorAll('.gallery-item');
    console.log('Nombre total d\'images dans la galerie :', images.length);

    // Crée un ensemble pour stocker les tags uniques
    const uniqueTags = new Set();
    images.forEach(image => {
        // Récupère le tag de chaque image et l'ajoute à l'ensemble des tags uniques
        const tag = image.getAttribute('data-gallery-tag');
        uniqueTags.add(tag);
    });
    console.log('Tags uniques trouvés dans la galerie :', Array.from(uniqueTags));

    // Initialise une variable pour suivre l'index de l'image en plein écran
    let currentImageIndex = null;

    // Fonction pour créer les boutons de tag
    function createTagButtons() {
        const boutonsDiv = document.createElement('div');
        boutonsDiv.classList.add('boutons-div');
        // Crée un bouton pour afficher toutes les images
        const buttonAll = createTagButton('Tous', true);
        boutonsDiv.appendChild(buttonAll);
        // Crée des boutons pour chaque tag unique
        uniqueTags.forEach(tag => {
            const button = createTagButton(tag);
            boutonsDiv.appendChild(button);
        });
        return boutonsDiv;
    }

    // Fonction pour créer un bouton de tag
    function createTagButton(tag, isActive = false) {
        const button = document.createElement('button');
        button.textContent = tag;
        button.classList.add('bouton-tag');
        // Ajoute la classe 'active' au bouton s'il est actif
        if (isActive) {
            button.classList.add('active');
        }
        // Ajoute un événement de clic pour filtrer les images par tag
        button.addEventListener('click', () => filtrerParTag(tag));
        return button;
    }

    // Sélectionne le titre et insère les boutons de tag après lui
    const title = document.querySelector('.title');
    title.insertAdjacentElement('afterend', createTagButtons());

    // Fonction pour filtrer les images par tag
    function filtrerParTag(tag) {
        images.forEach(image => {
            if (tag === 'Tous' || image.getAttribute('data-gallery-tag') === tag) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });
        // Met à jour les classes des boutons de tag pour refléter l'état actif
        const buttons = document.querySelectorAll('.bouton-tag');
        buttons.forEach(button => {
            if (button.textContent === tag) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Initialise une variable pour l'image en plein écran actuelle
    let currentFullscreen = null;

    // Fonction pour afficher une image en plein écran
    function showFullscreenImage(image) {
        currentFullscreen = document.createElement('div');
        currentFullscreen.classList.add('fullscreen');
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        // Crée des boutons de navigation pour l'image en plein écran
        const prevButton = createNavigationButton('prev');
        const nextButton = createNavigationButton('next');
        imageContainer.appendChild(prevButton);
        imageContainer.appendChild(nextButton);
        currentFullscreen.appendChild(imageContainer);
        document.body.appendChild(currentFullscreen);
        // Ajoute un événement de clic pour fermer l'image en plein écran en cliquant en dehors de celle-ci
        currentFullscreen.addEventListener('click', (e) => {
            if (e.target === currentFullscreen) {
                document.body.removeChild(currentFullscreen);
                currentImageIndex = null; // Réinitialise l'index de l'image en plein écran
            }
        });
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = image.src;
        fullscreenImg.alt = image.alt;
        imageContainer.appendChild(fullscreenImg);

        // Met à jour l'index avec l'image actuellement cliquée
        currentImageIndex = Array.from(images).indexOf(image);
    }

    // Fonction pour créer les boutons de navigation pour l'image en plein écran
    function createNavigationButton(direction) {
        const button = document.createElement('button');
        button.innerHTML = direction === 'prev' ? '<i class="fas fa-chevron-left"></i>' : '<i class="fas fa-chevron-right"></i>';
        button.classList.add('navigation-button', direction);
        button.addEventListener('click', () => navigate(direction));
        return button;
    }

    // Fonction pour naviguer entre les images en plein écran
    function navigate(direction) {
        if(currentImageIndex === null) return; // Vérifie si l'index est défini
        const newIndex = direction === 'prev' ? (currentImageIndex - 1 + images.length) % images.length : (currentImageIndex + 1) % images.length;
        const newImage = images[newIndex];
        // Met à jour l'image en plein écran avec la nouvelle image
        currentFullscreen.querySelector('img').src = newImage.src;
        currentFullscreen.querySelector('img').alt = newImage.alt;
        // Met à jour l'index de l'image actuelle
        currentImageIndex = newIndex;
    }

    // Ajoute un événement de clic à chaque image pour afficher en plein écran
    images.forEach(image => {
        image.addEventListener('click', () => showFullscreenImage(image));
    });
});
