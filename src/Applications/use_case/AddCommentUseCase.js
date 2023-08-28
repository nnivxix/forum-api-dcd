const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(owner, threadId, useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.getThreadById(threadId);
    return this._commentRepository.addComment(owner, threadId, newComment);
  }
}
module.exports = AddCommentUseCase;
