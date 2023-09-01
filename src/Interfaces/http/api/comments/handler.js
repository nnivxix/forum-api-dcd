const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(
      credentialId,
      threadId,
      request.payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.execute(commentId, id, threadId);

    const response = h.response({
      status: "success",
    });
    return response;
  }
}

module.exports = CommentsHandler;
