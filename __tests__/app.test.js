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

describe("GET review by id, api/reviews/:review_id", () => {
  test(`Status 200 - responds with a review object which should have a review_id, title, review_body, designer, review_image_url, votes, category field, owner field and created_at properties.`, () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toBeInstanceOf(Object);
        expect.objectContaining({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(Number),
        });
      });
  });
  test("Status 404 - returns `Route not found` message if the review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/9999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found");
      });
  });
  test("Status 400 - returns `Bad request` message if something that is not a number is passed as the review_id", () => {
      return request(app)
      .get("/api/reviews/cats")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request")
      })
  })
});
