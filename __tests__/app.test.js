process.env.NODE_END = "test";
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data");

//console.log(categoryData, "<-------------")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Incorrect paths", () => {
    test("Status 404, responds with Route not found", () => {
      return request(app)
        .get("/api/chickens")
        .expect(404)
        .then((reponse) => {
          expect(reponse.body.msg).toBe("Route not found");
        });
    });
  });


describe("GET categories api/categories", () => {
  test('Status 200 -- responds with an array of category objects, each with a "slug" and "description" property', () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((category) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
