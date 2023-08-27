class Thread {
  /**
   * @param {object} payload
   * @param {string} payload.id
   * @param {string} payload.title
   * @param {string} payload.body
   * @param {Date} payload.date
   * @param {string} payload.username
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.created_at = payload.created_at;
    this.username = payload.username;
  }

  _verifyPayload({ id, title, body, created_at, username }) {
    if (!id || !title || !body || !created_at || !username) {
      throw new Error("THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      !(created_at instanceof Date) ||
      typeof username !== "string"
    ) {
      throw new Error("THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = Thread;
