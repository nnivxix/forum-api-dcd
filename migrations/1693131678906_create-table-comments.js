/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  /** TODO
   * id
   * content
   * thread_id
   * owner
   * created_at
   */

  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "VARCHAR(150)",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint(
    "comments",
    "fk_comments.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users (id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "comments",
    "fk_comments.owner_threads.id",
    "FOREIGN KEY(thread_id) REFERENCES threads (id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
