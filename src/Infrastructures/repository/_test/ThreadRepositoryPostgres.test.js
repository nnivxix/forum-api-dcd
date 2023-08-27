const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

const pool = require("../../database/postgres/pool");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

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
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");

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
      const addedThread = await threadRepoPostgres.addThread(
        newThread,
        "user-123"
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: newThread.title,
          owner: "user-123",
        })
      );
    });
  });
});
