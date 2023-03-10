const fs = require('fs')
const client = require('https');

const downloadPokemonImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    try {
      client.get(url, (res) => {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`Image saved to ${filepath}`);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Error downloading image: ${err.message}`);
      });
    } catch (err) {
      reject(err);
    }
  })
};

function getPokemonInfo(name, imageType) {
  return new Promise((resolve, reject) => {
    try {
      let urlBase = 'https://pokeapi.co/api/v2/pokemon/';
      client.get(`${urlBase}${name}`, res => {
        let data = '';
        let statusCode = res.statusCode;
        res.on("data", d => {
          data += d;
        })
        res.on('end', () => {
          resolve(data,statusCode)
        })
      })
    } catch (err) {
      reject(err);
    }
  });
}

const getPokemonImageByNameType = async (req, res) => {
  const name = req.query.name;
  const imageType = req.query.imageType || 'front_default';
  const filePath = `./images/${name}_${imageType}.png`;
  if (!name) {
    return res.status(400).send('Pokemon name is necesary');
  }
  if (imageType !== "front_default" && imageType !== "front_shiny") {
    return res.status(400).send("The image type only accepts front_default or front_shiny as imageType");
  }

  if (!fs.existsSync(filePath)) {
    console.log("From the POKEAPI Downloading")
    getPokemonInfo(name, imageType)
      .then((pokemonInfo,statusCode) => {
        if (statusCode !== 200) {
          return res.status(404).send('Pokemon not found');
        }
        const urlImage = JSON.parse(pokemonInfo).sprites[imageType]
        downloadPokemonImage(urlImage, filePath)
          .then(() => {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                res.status(404).send({ message: err.message });
              } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(data);
              }
            });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      })
  }
  else {
    console.log('From the images directory')
    fs.readFile(filePath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    });
  }

}

module.exports = {
  getPokemonImageByNameType
}