import { Hono } from "hono";

type Pet = {
  id: number;
  name: string;
  tag?: string;
};

const pets: Pet[] = [
  { id: 1, name: "doggie", tag: "dog" },
  { id: 2, name: "kitty", tag: "cat" },
  { id: 3, name: "birdie", tag: "bird" },
];

let nextId = 4;

const app = new Hono()
  .get("/", (c) => {
    const limit = c.req.query("limit");
    if (limit) {
      return c.json(pets.slice(0, Number(limit)));
    }
    return c.json(pets);
  })
  .post("/", async (c) => {
    const body = await c.req.json<{ name: string; tag?: string }>();
    const pet: Pet = { id: nextId++, name: body.name, tag: body.tag };
    pets.push(pet);
    return c.json(pet, 201);
  })
  .get("/:petId", (c) => {
    const petId = Number(c.req.param("petId"));
    const pet = pets.find((p) => p.id === petId);
    if (!pet) {
      return c.json({ code: 404, message: "Pet not found" }, 404);
    }
    return c.json(pet);
  });

export default app;
