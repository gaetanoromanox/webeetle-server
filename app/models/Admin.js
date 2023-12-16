const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) { 
    return sequelize.define('Admin',  {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        mail: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "operator_mail_key"
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
      });
    };
    