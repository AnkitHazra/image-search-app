const API_KEY = '46200064-cbefdb29056395b7ceb229d7e';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const imageGrid = document.getElementById('image-grid');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const closeModal = document.getElementById('close-modal');
const downloadLink = document.getElementById('download-link');
const shareButton = document.getElementById('share-button');

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query === '') {
    alert('Please enter a search term.');
    return;
  }

  const url = `${BASE_URL}&q=${encodeURIComponent(query)}&image_type=photo`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    imageGrid.innerHTML = '';

    if (data.hits.length === 0) {
      imageGrid.innerHTML = '<p>No images found.</p>';
    } else {
   
      displayImages(data.hits);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    imageGrid.innerHTML = '<p>Failed to load images. Please try again later.</p>';
  }
});

function displayImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('image-card');

    const imgElement = document.createElement('img');
    imgElement.src = image.previewURL;
    imgElement.alt = image.tags;
    imgElement.title = `Author: ${image.user}`;
    imgElement.addEventListener('click', () => openModal(image));

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.innerHTML = `<p>${image.tags}</p><p>Author: ${image.user}</p>`;

    card.appendChild(imgElement);
    card.appendChild(cardContent);
    imageGrid.appendChild(card);
  });
}

function openModal(image) {
  modalImage.src = image.largeImageURL;
  modalTitle.textContent = `Tags: ${image.tags}`;
  modalAuthor.textContent = `Author: ${image.user}`;
  modal.style.display = 'flex'; 
  document.querySelector('.modal-content').classList.add('active'); 

  downloadLink.href = image.largeImageURL;

  shareButton.onclick = function () {
    if (navigator.share) {
      navigator.share({
        title: `Check out this image by ${image.user}`,
        text: `Tags: ${image.tags}`,
        url: image.largeImageURL
      }).catch(error => console.error('Error sharing:', error));
    } else {
      alert('Sharing not supported on this browser.');
    }
  };
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none'; })
