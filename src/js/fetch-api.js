import { Axios } from 'axios';

const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '24460881-0553146689c5f43d3df866ca4';

export default class ApiService {

constructor() {
    this.searchName = '';
    this.pages = 1;
    this.limit = 40;
    this.totalLimit = 0;
}

fetchPixbay = async (searchName) => {
    const fetch = await axios({
        url: `/?key=${API_KEY}&q=${this.searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pages}&per_page=${this.limit}`,
        method: 'get',
        baseURL: BASE_URL,
    }).then(response => {
        console.log(response.data)
        this.totalLimit += this.limit;
            if (response.data.totalHits - this.totalLimit < this.limit) {
                this.limit = response.data.totalHits - this.totalLimit;
            }
            this.plusPage();
            return response.data;  
    });
    return fetch;
}

plusPage() {
    this.pages += 1;
}

resetPages(){
    this.pages = 1;
}

resetLimit(){
    this.limit = 40;
}

resetTotalLimit(){
    this.totalLimit = 0;
}

get name() {
    return this.searchName;
}

set name(newName) {
    this.searchName = newName;
}
}