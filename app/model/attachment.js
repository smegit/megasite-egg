'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, VIRTUAL } = app.Sequelize;
  const Attachment = app.model.define('attachment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    type: STRING(30),
    attachment: STRING(30),
    file_type: STRING(30),
    url: STRING,
    uid: STRING(30),
    status: {
      type: VIRTUAL,
      get() {
        return 'done';
      },
    },
    // uid: {
    //     type: VIRTUAL,
    //     get() {
    //         return Math.random().toString(36).substring(7);
    //     },
    // },

    description: TEXT,
    created_at: DATE,
    updated_at: DATE,
  });

  return Attachment;
};
