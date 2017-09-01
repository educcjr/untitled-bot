import fetch from 'isomorphic-fetch';

class UserService {
  constructor (domain) {
    this.domain = domain;
  }

  getAll () {
    return fetch(this.domain + '/user')
      .then(result => result.json());
  }
}

export default UserService;
