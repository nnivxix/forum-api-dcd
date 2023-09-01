const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and added thread", async () => {
      const payload = {
        title: "Ini adalah title",
        body: "Ini Adalah Body",
      };
      //   await UsersTableTestHelper.addUser({ id: "user-123" });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const response = await server.inject({
        url: "/threads",
        method: "POST",
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });
    it("should response 400 when bad payload", async () => {
      const payload = {
        title: "test",
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const response = await server.inject({
        url: "/threads",
        method: "POST",
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
    it("should response 401 when not authorize", async () => {
      const payload = {
        title: "test",
        body: "test",
      };

      const server = await createServer(container);
      const response = await server.inject({
        url: "/threads",
        method: "POST",
        payload: payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });
  describe("when GET /thread/{threadId}", () => {
    it("should return 404 when thread not found", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        url: "/threads/thread-9",
        method: "GET",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });
    it("should return 200 when thread exist", async () => {
      const payload = {
        id: "thread-123",
        title: " ini tittle",
        body: "ini body",
        owner: "user-321",
      };

      const userPayload = [
        {
          id: "user-123",
          username: "jhondoe",
        },
        {
          id: "user-321",
          username: "dicoding",
        },
      ];

      const commentPayload = [
        {
          id: "comment-123",
          owner: "user-123",
          content: "sebuah comment",
          thread: "thread-123",
        },
        {
          id: "comment-321",
          owner: "user-321",
          thread: "thread-123",
          content: "sebuah comment",
        },
      ];
      const expectedComments = [
        {
          id: "comment-123",
          username: "jhondoe",
          content: "sebuah comment",
          is_delete: false,
        },
        {
          id: "comment-321",
          username: "dicoding",
          content: "sebuah comment",
          is_delete: false,
        },
      ];
      const expectedData = {
        id: "thread-123",
        title: " ini tittle",
        body: "ini body",
      };
      const expectedDetailThread = {
        ...expectedData,
        username:
          payload.username == userPayload[0].id
            ? userPayload[0].username
            : userPayload[1].username,
        comments: expectedComments,
      };
      await UsersTableTestHelper.addUser(userPayload[0]);
      await UsersTableTestHelper.addUser(userPayload[1]);
      await ThreadsTableTestHelper.addThread(payload);
      await CommentsTableTestHelper.addComment(commentPayload[0]);
      await CommentsTableTestHelper.addComment(commentPayload[1]);

      const server = await createServer(container);
      const response = await server.inject({
        url: "/threads/thread-123",
        method: "GET",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toEqual(expectedDetailThread);
    });
  });
});
