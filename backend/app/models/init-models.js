const DataTypes = require("sequelize").DataTypes;
const _user = require('./User')
const _admin = require('./Admin')
const _film = require('./Film')

function initModels(sequelize) {

  const User = _user(sequelize, DataTypes)
  const Admin = _admin(sequelize, DataTypes)
  const Film = _film(sequelize, DataTypes)

  return {
    User,
    Admin,
    Film
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
