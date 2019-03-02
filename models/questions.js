'use strict';
module.exports = (sequelize, DataTypes) => {
  const questions = sequelize.define('questions', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: DataTypes.STRING,
    sessionId: DataTypes.STRING,
    question: DataTypes.STRING
  }, {});
  questions.associate = function(models) {
    // associations can be defined here
  };
  return questions;
};