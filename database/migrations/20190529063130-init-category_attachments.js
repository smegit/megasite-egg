'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    await queryInterface.createTable('category_attachments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      category_id: {
        type: INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        },
        allowNull: false
      },
      attachment_id: {
        type: INTEGER,
        references: {
          model: 'attachments',
          key: 'id'
        },
        allowNull: false
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('category_attachments');
  }
};
