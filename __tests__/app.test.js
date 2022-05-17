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

        expect(review.review_id).toBe(1);

        expect.objectContaining({
          review_id: 1,
          title: "Agricola",
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
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("Update review by review_id, PATCH /api/reviews/:review_id", () => {
  test(`Status 201 - Returns with the updated review, when provided with a review_id and a new Vote object`, () => {
    const newVote = { inc_votes: 3 };

    //votes has 5 originally, adds 3 from inc_votes
    const expected = {
      review_id: 2,
      title: "Jenga",
      designer: "Leslie Scott",
      owner: "philippaclaire9",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Fiddly fun for all the family",
      category: "dexterity",
      created_at: "2021-01-18T10:01:41.251Z",
      votes: 8,
    };

    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(201)
      .then(({ body: { updatedReview } }) => {
        expect(updatedReview).toEqual(expected);
      });
  });
  test("404 - Valid number in path but doesn't match a review", () => {
    const newVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/999999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("400 - Something that is not a number is passed as the id", () => {
    const newVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/reviews/parrots")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 - Something that is not a number is passed as the inc_votes amount", () => {
    const newVote = { inc_votes: "stop breaking my test" };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
