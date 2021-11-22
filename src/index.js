import cardTemplate from './template/content-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './js/fetch-api.js';
import debounce from 'lodash/debounce';
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
    const string = event.currentTarget.querySelector('.input-search').value.trim();
    if (string !== '') {
        apiService.name = string;
        console.log(apiService.name)
        clearSearch();
        apiService.resetPages();
        apiService.fetchPixbay().then(data => {
            if (data.totalHits === 0){
                clearSearch();
                loadMoreBtn.classList.add('visually-hidden');
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }else {
            clearSearch();
            renderGalleryCard(data);
            loadMoreBtn.classList.remove('visually-hidden');
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            totalHint = data.hits.length;
            lightbox.refresh();
            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
              top: cardHeight * 0.5,
              behavior: 'smooth',
            });
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
        if(totalHint > data.totalHits){
            loadMoreBtn.classList.add('visually-hidden')
            Notify.failure("We're sorry, but you've reached the end of search results.");
        }else {
            renderGalleryCard(data);
            lightbox.refresh();
        }
    })
    .catch(error => {
    console.log(error)});
}

// const loadScroll = (event) => {
//     apiService.fetchPixbay().then(data => {
//         totalHint += data.hits.length;
//         console.log(totalHint);
//         console.log(data.totalHits);
//         if(totalHint > data.totalHits){
//             loadMoreBtn.classList.add('visually-hidden')
//             Notify.failure("We're sorry, but you've reached the end of search results.");
//         }else {
//             renderGalleryCard(data);
//             lightbox.refresh();
//         }
//     })
//     .catch(error => {
//     console.log(error)});
// }

// window.addEventListener('scroll', debounce(loadScroll, 300, { trailing: false, leading: true }));
form.addEventListener('submit', searchContent);
loadMoreBtn.addEventListener('click', loadMore)
