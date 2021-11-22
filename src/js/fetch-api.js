import { Axios } from 'axios';

const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '24460881-0553146689c5f43d3df866ca4';

export default class ApiService {

constructor() {
    this.searchName = '';
    this.pages = 1;
}

fetchPixbay = async (searchName) => {
    const fetch = await axios({
        url: `/?key=${API_KEY}&q=${this.searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pages}&per_page=40`,
        method: 'get',
        baseURL: BASE_URL,
    }).then(response => {
            console.log(response.data)
            this.plusPage()
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

get name() {
    return this.searchName;
}

set name(newName) {
    this.searchName = newName;
}
}