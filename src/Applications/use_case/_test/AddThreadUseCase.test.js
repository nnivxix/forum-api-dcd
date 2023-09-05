const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestracting the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "thread title",
      body: "thread body",
    };
    const owner = "user-123";
    const payloadAddeThread = {
      id: "thread-123",
      owner: "user-123",
      title: "thread title",
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new AddedThread(payloadAddeThread))
      );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(addThread).toStrictEqual(new AddedThread(payloadAddeThread));
    expect(mockThreadRepository.addThread).toBeCalledWith(
      useCasePayload,
      owner
    );
  });
});
