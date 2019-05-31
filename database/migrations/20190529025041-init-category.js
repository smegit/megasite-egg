'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    await queryInterface.createTable('categories', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      description: TEXT,
      parent_id: INTEGER,
      created_at: DATE,
      updated_at: DATE,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categories');
  }
};
