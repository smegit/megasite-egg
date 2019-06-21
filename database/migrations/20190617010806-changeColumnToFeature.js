'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('features', 'long_description', { type: Sequelize.TEXT });
    await queryInterface.changeColumn('features', 'short_description', { type: Sequelize.TEXT });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('features', 'long_description', { type: Sequelize.STRING });
    await queryInterface.changeColumn('features', 'short_description', { type: Sequelize.STRING });
  }
};
