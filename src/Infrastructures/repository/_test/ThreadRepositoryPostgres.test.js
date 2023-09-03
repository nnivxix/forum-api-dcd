const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

const pool = require("../../database/postgres/pool");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const NewThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
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
    it("should presist new thread", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      const newThread = new NewThread({
        title: "A thread",
        body: "A thread body",
      });
      const fakeIdGen = () => "123";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepoPostgres.addThread(newThread, "user-123");

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById("thread-123");

      expect(threads).toHaveLength(1);
    });

    it("should return AddedThread correctly", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding", // test
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const newThread = new NewThread({
        title: "A thread",
        body: "A thread body",
      });
      const fakeIdGen = () => "123";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      const addThread = await threadRepoPostgres.addThread(
        newThread,
        "user-123"
      );

      // Assert
      expect(addThread).toStrictEqual({
        id: "thread-123",
        title: newThread.title,
        owner: "user-123",
      });
    });
  });
  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(
        threadRepositoryPostgres.getThreadById("fakeId")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread's information when thread found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      // Action
      const result = await threadRepositoryPostgres.getThreadById("thread-123");
      expect(result.title).toEqual("sebuah thread");
      expect(result.body).toEqual("sebuah body thread");
    });
  });
});
