import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { client, listPets, createPet } from "@app/api";
import type { Pet } from "@app/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  exampleStore,
  incrementCount,
  setPets,
  addPet,
} from "@/stores/example";

client.setConfig({ baseUrl: "/api" });

const petFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

function App() {
  const snap = useSnapshot(exampleStore);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      tag: "",
    },
  });

  useEffect(() => {
    const fetchPets = async () => {
      const { data } = await listPets();
      if (data) {
        setPets(data as Pet[]);
      }
    };
    fetchPets();
  }, []);

  const onSubmit = async (values: PetFormValues) => {
    const { data } = await createPet({
      body: { name: values.name, tag: values.tag || undefined },
    });
    if (data) {
      addPet(data as Pet);
      form.reset();
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Tech Stack Demo</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Valtio Counter</h2>
        <p className="mb-2">
          Count: <span data-testid="count">{snap.count}</span>
        </p>
        <Button onClick={incrementCount} data-testid="increment-btn">
          Increment
        </Button>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Add Pet</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Tag (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Pet</Button>
          </form>
        </Form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Pet List</h2>
        {snap.pets.length === 0 ? (
          <p className="text-muted-foreground">No pets loaded.</p>
        ) : (
          <ul className="space-y-2">
            {snap.pets.map((pet) => (
              <li key={pet.id} className="rounded border p-3">
                <span className="font-medium">{pet.name}</span>
                {pet.tag && (
                  <span className="ml-2 text-muted-foreground">({pet.tag})</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
