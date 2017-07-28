const express = require('express');
const app = express();

app.get('/api', (req, res) => {
  res.send('Hooray!');
});

const port = 5000;
app.listen(port, () => {
  console.log('Api running on: ' + port);
});
