import { proxy } from "valtio";
import type { Pet } from "@app/api";

type ExampleStore = {
  count: number;
  pets: Pet[];
};

export const exampleStore = proxy<ExampleStore>({
  count: 0,
  pets: [],
});

export const incrementCount = () => {
  exampleStore.count++;
};

export const setPets = (pets: Pet[]) => {
  exampleStore.pets = pets;
};

export const addPet = (pet: Pet) => {
  exampleStore.pets.push(pet);
};
