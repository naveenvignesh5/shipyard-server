"use strict";

const keyMirror = require("keymirror");
const bcrypt = require("bcrypt-nodejs");

const ENUM_USER_TYPE = keyMirror({
  admin: null,
  speaker: null,
  client: null
});

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ENUM_USER_TYPE.client
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  User.ENUM_USER_TYPE = ENUM_USER_TYPE;

  User.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };

  User.prototype.isSpeaker = function() {
    return this.role === ENUM_USER_TYPE.speaker;
  };

  User.prototype.isClient = function() {
    return this.role === ENUM_USER_TYPE.client;
  };

  User.prototype.isAdmin = function() {
    return this.role === ENUM_USER_TYPE.admin;
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.validType = function(role) {
    return role === User.role;
  };

  User.associate = function(models) {
    // associations can be defined here
    // User.hasMany(models.session, { foreignKey: 'adminId' });
  };

  return User;
};
