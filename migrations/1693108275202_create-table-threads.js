/* eslint-disable camelcase */

exports.up = (pgm) => {
  /** TODO
   * id
   * title
   * body
   * owner
   * created_at
   */
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    body: {
      type: "VARCHAR(150)",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint(
    "threads",
    "fk_threads.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users (id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
