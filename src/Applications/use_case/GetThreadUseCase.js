class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    thread.comments = await this._commentRepository.getCommentByThreadId(
      useCasePayload
    );
    return thread;
  }
}
module.exports = GetThreadUseCase;
