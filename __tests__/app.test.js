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
  test("Status 404, responds with Not found", () => {
    return request(app)
      .get("/api/chickens")
      .expect(404)
      .then((reponse) => {
        expect(reponse.body.msg).toBe("Not found");
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

        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
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
  test(`Status 200 - Returns with the updated review, when provided with a review_id and a new Vote object`, () => {
    const newVote = { inc_votes: 3 };

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
      .expect(200)
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
        expect(body.msg).toBe("Not found");
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
  test("Status 400 - no inc_votes key in body of patch request", () => {
    const bodyToSend = { sausageVotes: 15 };
    return request(app)
      .patch("/api/reviews/3")
      .send(bodyToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET all users /api/users", () => {
  test("Status 200, returns with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET - /api/reviews/:review_id (comment count)", () => {
  test("Status 200 - returns a review object when a review id is inputted, including a comment count", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 2,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: "2021-01-18T10:01:41.251Z",
            //comment_count: expect.any(Number),
          })
        );
      });
  });
});

describe("GET - /api/reviews", () => {
  test("Status 200- should respond with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);

        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.not.objectContaining({
              review_body: expect.anything(),
            })
          );
          expect(review).toEqual({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Status 200 - returns the array of reviews sorted by creation date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET - /api/reviews/:review_id/comments", () => {
  test("Status 200 - should respond with an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            })
          );
        });
      });
  });
  test("Status 404 - Valid number passed as the review_id, but doesn't match a review_id ", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Status 400 - Something that is not a number is passed as the review_id", () => {
    return request(app)
      .get("/api/reviews/chicken/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Status 200 - Valid review_id number passed but no comments are present for that review_id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("should add a comment object witha  username and body properties, and return the posted comment", () => {
    const newComment = {
      username: "mallionaire",
      body: "I hope this comment is posted",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            author: "mallionaire",
            body: "I hope this comment is posted",
            review_id: 2,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400 - body is missing a mandatory key", () => {
    const newComment = {
      username: "mallionaire",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Mandatory field missing");
      });
  });
  test("404 - the review_id in the path does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "I hope this comment is posted",
    };

    return request(app)
      .post("/api/reviews/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("404 - A user not in the database tries to post", () => {
    const newComment = {
      username: "Gandalf the Grey",
      body: "Fly you fools!",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
  test("400 - An invalid review_id is passed when trying to post a comment", () => {
    const newComment = {
      username: "mallionaire",
      body: "I hope this comment is posted",
    };

    return request(app)
      .post("/api/reviews/frodo/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/reviews(queries)", () => {
  test("Status 200 - responds with an array of review objects, sorted by date as default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status 200 - responds with an array of review objects, sorted by a valid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("Status 400 - Returns a bad request message when trying to sort by an invalid parameter", () => {
    return request(app)
      .get("/api/reviews?sort_by=jolteon")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 200 - responds with an array of review objects, ordered by a valid column (ascending or descending)", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at");
      });
  });
  test("Status 200 - responds with an array of review objects, sorted by a valid parameter and ordered by a valid column (ascending or descending)", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("votes");
      });
  });
  test("Status 400 - responds with a `Bad request` message when trying to order by something that isn't ascending or descending", () => {
    return request(app)
      .get("/api/reviews?order=puppies")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 200 - responds with an array of reviews objects, filtered by a valid inputted category", () => {
    return request(app)
      .get(`/api/reviews?category=dexterity`)
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(1);
        expect(reviews[0].category).toBe("dexterity");
      });
  });

  test("Status 200 - responds with an empty array when filtering by a valid category with no results", () => {
    return request(app)
      .get(`/api/reviews?category=children's games`)
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toEqual([]);
      });
  });
  test("Status 404 - responds with a `Not found` message when trying to filter by a category which doesn't exist", () => {
    return request(app)
      .get(`/api/reviews?category=boring games`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Status 204 - Deletes a specified comment by commend_id, returning nothing apart from a 204 status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("Status 400 - comment_id in path is not a number", () => {
    return request(app)
      .delete("/api/comments/youreawizardharry")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 404 - comment_id in path does not exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
describe("GET /api", () => {
  test.only("Should return an object with the API endpoints on", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { data } }) => {
        console.log(data)
        expect(data).toBeInstanceOf(Object);

        const expected = {
          description: "serves an array of all categories",
          queries: [],
          exampleResponse: {
            categories: [
              {
                description:
                  "Players attempt to uncover each other's hidden role",
                slug: "Social deduction",
              },
            ],
          },
        };

        expect(data["GET /api/categories"]).toEqual(expected);

        expect(Object.keys(data)).toContain("GET /api/reviews/:review_id");
      });
  });
});

describe("GET /api/users/:username user by username", () => {
  test("Status 200 -  should return a user object when passed a valid username", () => {
    return request(app)
      .get("/api/users/bainesface")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toBeInstanceOf(Object);
        expect(user).toEqual({
          username: "bainesface",
          name: "sarah",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });
  test("Status 404 - should return with a `Not found` error message when a username doesn't exist", () => {
    return request(app)
      .get("/api/users/notavalidusername")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id - update comment votes by comment id", () => {
  test("Status 200 - Should update the number of votes by a passed amount of votes, when given a valid comment_id, and returns the updated comment object", () => {
    const updateVote = { inc_votes: 3 };

    return request(app)
      .patch("/api/comments/2")
      .expect(200)
      .send(updateVote)
      .then(({ body: { comment } }) => {
        const expected = {
          comment_id: 2,
          body: "My dog loved this game too!",
          votes: 16,
          author: "mallionaire",
          review_id: 3,
          created_at: "2021-01-18T10:09:05.410Z",
        };
        expect(comment).toEqual(expected);
      });
  });
  test("Status 400 - Bad request message is returned when given a comment id which is not a number", () => {
    const updateVote = { inc_votes: 3 };

    return request(app)
      .patch("/api/comments/notanumber")
      .expect(400)
      .send(updateVote)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 404 - Not found message is returned when a numerical comment id which doesn't exist is given", () => {
    const updateVote = { inc_votes: 3 };

    return request(app)
      .patch("/api/comments/999243927")
      .expect(404)
      .send(updateVote)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("Status 400 - Bad request message is returned when an object without the mandatory key `inc_votes` is missing", () => {
    const updateVote = { invalidKey: 3 };

    return request(app)
      .patch("/api/comments/2")
      .expect(400)
      .send(updateVote)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 400 - Bad request message is returned when the passed object with inc_votes doesn't have a numerical value", () => {
    const updateVote = { inc_votes: "notNumber" };

    return request(app)
      .patch("/api/comments/2")
      .expect(400)
      .send(updateVote)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
describe("POST /api/reviews - add new review", () => {
  test.only("Status 200 - should add a review object and return that object", () => {
    const newReview = {
      title: "Best game ever",
      designer: "Mr bean",
      owner: "mallionaire",
      review_body: "This is awesome!",
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .expect(201)
      .send(newReview)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            title: "Best game ever",
            designer: "Mr bean",
            owner: "mallionaire",
            review_body: "This is awesome!",
            category: "euro game",
            review_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            review_img_url: expect.any(String),
            //comment_count: expect.any(Number),
          })
        );
      });
  });
});

