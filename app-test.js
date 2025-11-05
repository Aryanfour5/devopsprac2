// app.test.js - Jest unit tests
const request = require("supertest");
const app = require("./app");

describe("Express App Tests", () => {
  test("GET / should return success message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello from Jenkins Pipeline");
    expect(response.body.status).toBe("success");
  });

  test("GET /api/health should return OK status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.health).toBe("OK");
  });

  test("App exports correctly", () => {
    expect(app).toBeDefined();
  });
});
