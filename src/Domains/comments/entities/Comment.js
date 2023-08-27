class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.username = payload.username;
  }

  _verifyPayload({ id, username, content }) {
    if (!id || !username || !content) {
      throw new Error("COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = Comment;
