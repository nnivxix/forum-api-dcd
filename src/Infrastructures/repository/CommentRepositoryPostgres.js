const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async addComment(owner, threadId, comment) {
    const { content } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, threadId, owner],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Comment tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyCommentExist(id) {
    const query = {
      text: "SELECT content FROM comments WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows == 0) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }
  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, users.username
            FROM comments
            LEFT JOIN users ON comments.owner = users.id
            WHERE comments.thread_id = $1 `,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    console.log(rows);
    return rows;
  }
}
module.exports = CommentRepositoryPostgres;
