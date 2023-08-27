const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe("add comment function", () => {
    it("should return registered comment correctly", async () => {
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const newThread = new NewThread({
        title: "A thread",
        body: "A thread body",
      });
      const registerComment = new NewComment({
        content: "ini content",
      });

      const fakeIdGen = () => "123";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGen
      );

      await userRepositoryPostgres.addUser(registerUser);
      await threadRepoPostgres.addThread(newThread, "user-123");
      const addedComment = await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        registerComment
      );

      const comments = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: registerComment.content,
          owner: "user-123",
        })
      );
      expect(comments).toHaveLength(1);
    });
  });

  describe("verify comment exist function", () => {
    it("should throw error when comment not found", async () => {
      const commentId = "comment-123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {}
      );
      await expect(
        commentRepositoryPostgres.verifyCommentExist(commentId)
      ).rejects.toThrowError(NotFoundError);
    });
    it("should not throw error when comment exist", async () => {
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const newThread = new NewThread({
        title: "A thread",
        body: "A thread body",
      });
      const registerComment = new NewComment({
        content: "ini content",
      });

      const fakeIdGen = () => "123";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGen
      );

      await userRepositoryPostgres.addUser(registerUser);
      await threadRepoPostgres.addThread(newThread, "user-123");
      await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        registerComment
      );

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        "comment-123"
      );

      // Assert
      expect(comment.id).toEqual("comment-123");
    });
  });

  describe("get Comment by Thread Id function", () => {
    it("should not throw error when comment exist", async () => {
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const newThread = new NewThread({
        title: "A thread",
        body: "A thread body",
      });
      const registerComment = new NewComment({
        content: "ini content",
      });
      const registerComment2 = new NewComment({
        content: "ini content",
      });

      const fakeIdGen = () => "123";
      const fakeIdGen2 = () => "124";

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGen
      );
      const commentRepositoryPostgres2 = new CommentRepositoryPostgres(
        pool,
        fakeIdGen2
      );

      await userRepositoryPostgres.addUser(registerUser);
      await threadRepoPostgres.addThread(newThread, "user-123");
      await commentRepositoryPostgres.addComment(
        "user-123",
        "thread-123",
        registerComment
      );
      await commentRepositoryPostgres2.addComment(
        "user-123",
        "thread-123",
        registerComment2
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        "thread-123"
      );

      expect(comments.length).toEqual(2);
    });
  });
});
