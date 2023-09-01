const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestracting the add thread action correctly", async () => {
    // Arrange
    const payload = {
      title: "A thread",
      body: "A thread body",
    };
    const owner = "user-123";

    const expectedThread = {
      id: "thread-123",
      title: "A thread",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: "thread-123",
        title: "A thread",
        owner: "user-123",
      })
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addThread = await addThreadUseCase.execute(payload, owner);

    // Assert
    expect(addThread).toStrictEqual(expectedThread);

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(payload),
      owner
    );
  });
});
