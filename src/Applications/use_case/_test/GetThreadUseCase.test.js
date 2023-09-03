const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get detail thread action correctly", async () => {
    const useCasePayload = {
      thread: "thread-123",
    };

    const thread = {
      id: "thread-123",
      title: "title",
      body: "body",
      username: "dicoding",
    };
    const comment = [
      {
        id: "comment-123",
        username: "test1",
        content: "content",
        created_at: "2023-09-03T03:21:51.620Z",
      },
      {
        id: "comment-124",
        username: "test2",
        content: "**komentar telah dihapus**",
        created_at: "2023-09-03T03:21:51.620Z",
      },
    ];
    const expectedResult = {
      id: "thread-123",
      title: "title",
      body: "body",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          content: "content",
          username: "test1",
          date: "2023-09-03T03:21:51.620Z",
        },
        {
          id: "comment-124",
          content: "**komentar telah dihapus**",
          username: "test2",
          date: "2023-09-03T03:21:51.620Z",
        },
      ],
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(thread));

    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comment));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCaseResult = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCasePayload
    );
    expect(useCaseResult).toEqual(expectedResult);
  });
});
