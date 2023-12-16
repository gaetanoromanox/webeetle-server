const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) { 
return sequelize.define('user', {
    mail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true, 
      },
      surname: {
        type: DataTypes.STRING(255),
        allowNull: true, 
      }, 
  });}