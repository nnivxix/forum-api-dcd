const Comment = require("../Comment");

describe("a Comment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "budi",
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: true,
      username: 12,
      content: ["example content"],
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Comment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "hanasa",
      content: "example content",
    };

    // Action
    const { id, username, content } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
  });
});
