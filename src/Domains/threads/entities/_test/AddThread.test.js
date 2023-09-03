const AddThread = require("../AddThread");

describe("AddThread entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "abc",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "title thread",
      body: [123, true, "body"],
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Thread object correctly", () => {
    // Arrange
    const payload = {
      title: "Title thread",
      body: "Body thead",
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
  });
});
