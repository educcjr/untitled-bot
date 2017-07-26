let express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('Hooray!');
});

app.listen(process.env.PORT, () => {
  console.log('Horray! ' + process.env.PORT);
});
