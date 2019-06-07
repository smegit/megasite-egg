'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    await queryInterface.createTable('attributes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      description: TEXT,
      ui_type: STRING(30),
      input_type: STRING(30),
      created_at: DATE,
      updated_at: DATE,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attributes');
  },
};
