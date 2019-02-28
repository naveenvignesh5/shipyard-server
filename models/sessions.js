"use strict";

module.exports = (sequelize, DataTypes) => {
  const Sessions = sequelize.define("sessions", {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    chatId: { type: DataTypes.STRING, allowNull: false },
    adminId: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    name: { type: DataTypes.STRING },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  Sessions.associate = function(models) {
    // associations can be defined here
  };
  return Sessions;
};
