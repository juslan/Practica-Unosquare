const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Pokemon API V1')
})

require('./routes/pokemon.routes')(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})