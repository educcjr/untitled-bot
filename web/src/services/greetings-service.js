import fetch from 'isomorphic-fetch';

class GreetingsService {
  constructor (domain) {
    this.domain = domain;
  }

  post (id, file) {
    let formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);
    return fetch(this.domain + '/audio-greeting', {
      method: 'POST',
      body: formData
    })
      .then(result => result.json());
  }

  get (id) {
    return fetch(`${this.domain}/audio-greeting/${id}`)
      .then(result => result.json());
  }

  delete (id) {
    return fetch(`${this.domain}/audio-greeting/${id}`, {
      method: 'DELETE'
    })
      .then(result => result.json());
  }
}

export default GreetingsService;
