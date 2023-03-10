const controller = require("../controllers/pokemon.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  })

  app.get(
    "/api/v1/images/pokemons",
    controller.getPokemonImageByNameType
  );
  // app.get(
  //   "/api/orders/user-access/:id",
  //   controller.getOrderUserAccess
  // );
}