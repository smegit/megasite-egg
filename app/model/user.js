'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // name: STRING(30),
    // age: INTEGER,
    firstname: STRING(30),
    surname: STRING(30),
    email: STRING(30),
    encrypted_password: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return User;
};
