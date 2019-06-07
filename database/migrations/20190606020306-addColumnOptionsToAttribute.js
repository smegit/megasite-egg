'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('attributes', 'options', Sequelize.ARRAY(Sequelize.STRING));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('attributes', 'options');
  }
};
