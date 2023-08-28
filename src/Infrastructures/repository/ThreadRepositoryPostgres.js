const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGen) {
    super();

    this._pool = pool;
    this._idGen = idGen;
  }

  async addThread(thread, owner) {
    const id = `thread-${this._idGen()}`;
    const { title, body } = thread;
    const created_at = new Date();

    const query = {
      text: `INSERT INTO threads VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING id, title, owner`,
      values: [id, owner, title, body, created_at],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, users.username FROM threads
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
