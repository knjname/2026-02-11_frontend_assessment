import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

vi.mock("@app/api", () => ({
  client: {
    setConfig: vi.fn(),
  },
  listPets: vi.fn().mockResolvedValue({ data: [] }),
  createPet: vi.fn().mockResolvedValue({ data: { id: 10, name: "newpet" } }),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the heading", () => {
    render(<App />);
    expect(screen.getByText("Tech Stack Demo")).toBeInTheDocument();
  });

  it("increments the counter when button is clicked", async () => {
    render(<App />);
    const countDisplay = screen.getByTestId("count");
    expect(countDisplay.textContent).toBe("0");

    const button = screen.getByTestId("increment-btn");
    await userEvent.click(button);

    expect(countDisplay.textContent).toBe("1");
  });

  it("shows the pet form", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Pet name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tag (optional)")).toBeInTheDocument();
  });
});
