let express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('Hooray!');
});

app.listen(3000);
