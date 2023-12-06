"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Trong file migration mới
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "deviceTokenCFM", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "deviceTokenCFM");
  },
};
