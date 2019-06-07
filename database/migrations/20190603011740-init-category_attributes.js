'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    await queryInterface.createTable('category_attributes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      category_id: {
        type: INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        allowNull: false,
      },
      attribute_id: {
        type: INTEGER,
        references: {
          model: 'attributes',
          key: 'id',
        },
        allowNull: false,
      },
      sort_order: { type: INTEGER },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('category_attributes');
  },
};
