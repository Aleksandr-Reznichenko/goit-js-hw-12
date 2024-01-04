'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '41511602-ac1f0d864a13fd01c911f294b';
const searchFormElement = document.querySelector('.search-form');
const galleryElement = document.querySelector('.gallery');
const textInputElement = document.querySelector('.search-input');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const loaderElement = document.querySelector('.loader');
loaderElement.style.display = 'none';

searchFormElement.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const inputValue = textInputElement.value.trim();

  if (!inputValue) {
    iziToast.warning({
      title: 'Warning!',
      message: 'Please enter image name!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  loaderElement.style.display = 'block';

  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  fetch(`https://pixabay.com/api/?${searchParams}`)
    .then(response => {
      loaderElement.style.display = 'none';

      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }
      renderImages(data.hits);
      lightbox.refresh();
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      iziToast.error({
        message: 'Failed to fetch images. Please try again later.',
        position: 'topRight',
      });
    });
}

function renderImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const imageCardElement = createImageCard(image);
    fragment.appendChild(imageCardElement);
  });

  galleryElement.appendChild(fragment);
}

function createImageCard(image) {
  const imageCardElement = document.createElement('div');
  imageCardElement.classList.add('card');

  imageCardElement.innerHTML = `
    <a class="gallery-link" href="${image.largeImageURL}">
        <img class="card-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      </a>
      <div class="card-info">
        <p class="card-text"><b>Likes:</b> ${image.likes}</p>
        <p class="card-text"><b>Views:</b> ${image.views}</p>
        <p class="card-text"><b>Comments:</b> ${image.comments}</p>
        <p class="card-text"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;

  return imageCardElement;
}

function clearGallery() {
  galleryElement.innerHTML = '';
}
