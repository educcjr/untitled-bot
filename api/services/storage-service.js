const firebase = require('firebase-admin');
const firebaseKey = require('./../../firebase-key.json');

const FOLDERS = {
  greetings: 'greetings'
};
const BUCKET = 'untitled-lounge.appspot.com';
const BUCKET_URL = `https://storage.googleapis.com/${BUCKET}/`;

class StorageService {
  constructor () {
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseKey),
      storageBucket: BUCKET
    });

    this.bucket = firebase.storage().bucket();
  }

  async upload (path, filename) {
    let resultPath = null;

    let destination = `${FOLDERS.greetings}/${filename}`;

    await this.bucket
      .upload(path, { destination, public: true })
      .then(data => {
        resultPath = `${BUCKET_URL}${destination}`;
      })
      .catch(err => console.error(err));

    return resultPath;
  }
}

module.exports = StorageService;
