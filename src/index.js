import cardTemplate from './template/content-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './js/fetch-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiService = new ApiService();

const renderGalleryCard = searchName => {
    gallery.insertAdjacentHTML('beforeend', cardTemplate(searchName.hits));
};

const clearSearch = () => {
    gallery.innerHTML = '';
}



let totalHint = 0;
let lightbox = new SimpleLightbox('.gallery a', {
    nav: true,
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
});

const searchContent = event => {
    event.preventDefault();
    clearSearch();
    loadMoreBtn.classList.add('visually-hidden');
    const string = event.currentTarget.querySelector('.input-search').value.trim();
    if (string !== "") {
        apiService.resetPages();
        apiService.resetLimit();
        apiService.resetTotalLimit();
        apiService.name = string;
        console.log(apiService.name)
        apiService.fetchPixbay().then(data => {
            if (data.totalHits === 0){
                clearSearch();
                loadMoreBtn.classList.add('visually-hidden');
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }else {
                if (data.totalHits <= 40) {
                    loadMoreBtn.classList.add('visually-hidden');
                } else {
                    loadMoreBtn.classList.remove('visually-hidden');
                }
            clearSearch();
            renderGalleryCard(data);
            apiService.resetPages();
            apiService.resetLimit();
            apiService.resetTotalLimit();
            
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            totalHint = data.hits.length;
            lightbox.refresh();
            }})   
            .catch(error => {
            console.log(error)});
    }else {
        clearSearch();
        loadMoreBtn.classList.add('visually-hidden')
    }
}




const loadMore = () => {
    apiService.fetchPixbay().then(data => {
        totalHint += data.hits.length;
        console.log(totalHint);
        console.log(data.totalHits);
        if (data.hits.length < 40){
            apiService.resetPages();
            loadMoreBtn.classList.add('visually-hidden')
            Notify.failure("We're sorry, but you've reached the end of search results.");
            renderGalleryCard(data);
            lightbox.refresh();
        }else {
            renderGalleryCard(data);
            lightbox.refresh();
        }
        
    })
    .catch(error => {
    console.log(error)});
}

form.addEventListener('submit', searchContent);
loadMoreBtn.addEventListener('click', loadMore);
