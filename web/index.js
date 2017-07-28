const path = require('path');
const express = require('express');
const app = express();

app.use('vendor.js', (req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Horray! ' + port);
});
