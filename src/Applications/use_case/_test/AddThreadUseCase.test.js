const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestracting the add thread action correctly", async () => {
    // Arrange
    const payload = {
      title: "A thread",
      body: "A thread body",
    };
    const owner = "user-123";

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: payload.title,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(payload, owner);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: "thread-123",
        title: payload.title,
        owner,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(payload),
      owner
    );
  });
});
