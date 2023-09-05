const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

const pool = require("../../database/postgres/pool");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should return new thread correctly", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "hanasa",
        password: "secret_password",
        fullname: "Hanasa",
      });

      const addThread = new AddThread({
        title: "thread title",
        body: "thread body",
      });
      const fakeIdGen = () => "123";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      const thread = await threadRepoPostgres.addThread(addThread, "user-123");

      // Assert
      expect(thread.id).toStrictEqual("thread-123");
      expect(thread.title).toStrictEqual("thread title");
      expect(thread.owner).toStrictEqual("user-123");
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread_id not found", () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action

      // Assert
      const thread = threadRepositoryPostgres.getThreadById("fakeId");
      expect(thread).rejects.toThrowError(NotFoundError);
    });

    it("should be success get thread by id", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "hanasa",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert
      expect(thread.title).toEqual("sebuah thread");
      expect(thread.body).toEqual("sebuah body thread");
    });
  });
});
