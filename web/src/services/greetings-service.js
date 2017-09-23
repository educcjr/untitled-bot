import fetch from 'isomorphic-fetch';

class GreetingsService {
  constructor (domain) {
    this.domain = domain;
  }

  post (id, file) {
    let formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);
    return fetch(this.domain + '/greetings/audio', {
      method: 'POST',
      body: formData
    })
      .then(result => result.json());
  }

  get (id) {
    return fetch(`${this.domain}/greetings/audio/${id}`)
      .then(result => result.json());
  }

  delete (id) {
    return fetch(this.domain + '/greetings/audio', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({fileName: id})
    })
      .then(result => result.json());
  }
}

export default GreetingsService;
