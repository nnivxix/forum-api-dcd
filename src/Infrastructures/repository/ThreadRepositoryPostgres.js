const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, id) {
    super();

    this._pool = pool;
    this._id = id;
  }

  async addThread(thread, owner) {
    const id = `thread-${this._id()}`;
    const { title, body } = thread;

    const query = {
      text: `INSERT INTO threads VALUES (
        $1, $2, $3, $4
      ) RETURNING id, title, body, owner`,
      values: [id, owner, title, body],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at as date, users.username FROM threads
             INNER JOIN users
             ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread tidak ditemukan");
    }

    return result.rows[0];
  }

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  }
}

module.exports = ThreadRepositoryPostgres;
