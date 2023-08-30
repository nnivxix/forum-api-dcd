class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);
    const thread = await this._threadRepository.getDetailThread(useCasePayload);
    thread.comments = await this._commentRepository.getCommentByThreadId(
      useCasePayload
    );
    return thread;
  }
}
module.exports = GetThreadUseCase;
