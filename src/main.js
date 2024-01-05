'use strict';

import axios from 'axios';
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
const loadMoreButton = document.querySelector('.load-more');
let currentPage = 1;

loaderElement.style.display = 'none';
loadMoreButton.classList.remove('visible');

searchFormElement.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
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
  showLoader();
  hideLoadMoreButton();

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    hideLoader();

    const data = response.data;

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

    if (currentPage * 40 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    hideLoader();
    iziToast.error({
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
  }
}

function renderImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const imageCardElement = createImageCard(image);
    fragment.appendChild(imageCardElement);
  });

  galleryElement.appendChild(fragment);

  currentPage++;
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
  currentPage = 1;
  hideLoadMoreButton();
}

async function loadMoreImages() {
  const inputValue = textInputElement.value.trim();

  if (!inputValue) {
    return;
  }

  showLoader();
  hideLoadMoreButton();

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    hideLoader();

    const data = response.data;

    if (data.hits.length === 0) {
      hideLoadMoreButton();
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();

    if (currentPage * 40 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

    const cards = document.querySelectorAll('.card');
    const newImages = Array.from(cards).slice(-40);
    if (newImages.length > 0) {
      const firstNewImage = newImages[0];

      firstNewImage.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    hideLoader();
    iziToast.error({
      message: 'Failed to fetch more images. Please try again later.',
      position: 'topRight',
    });
  }
}

function showLoader() {
  loaderElement.style.display = 'block';
}

function hideLoader() {
  loaderElement.style.display = 'none';
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}
