import { createElement, useState } from "react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ParentSettings } from "@/components/ParentSettings";
import type { Child } from "@/lib/types";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        return ({ children, ...props }: { children?: ReactNode }) =>
          createElement(tag, props, children);
      },
    }
  ),
  Reorder: {
    Group: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Item: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const initialChildren: Child[] = [
  {
    id: "child-1",
    name: "Lily",
    morning: [
      { id: "m1", title: "Make bed", icon: "bed", completed: false },
      { id: "m2", title: "Brush teeth", icon: "brush", completed: false },
    ],
    evening: [
      { id: "e1", title: "Go to bed", icon: "moon-star", completed: false },
    ],
  },
  {
    id: "child-2",
    name: "Mila",
    morning: [],
    evening: [],
  },
];

const readState = () => JSON.parse(screen.getByTestId("state").textContent ?? "{}") as Child[];

const Harness = ({ seedChildren = initialChildren }: { seedChildren?: Child[] }) => {
  const [children, setChildren] = useState(seedChildren);

  return (
    <div>
      <pre data-testid="state">{JSON.stringify(children)}</pre>
      <ParentSettings children={children} onChange={setChildren} onBack={() => {}} />
    </div>
  );
};

describe("ParentSettings", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renames a child in place", () => {
    render(<Harness />);

    const nameInput = screen.getByDisplayValue("Lily");
    fireEvent.change(nameInput, { target: { value: "LUNA" } });

    expect(readState()[0].name).toBe("LUNA");
  });

  it("adds a task with the selected icon and default completion state", () => {
    render(<Harness />);

    fireEvent.click(screen.getAllByRole("button", { name: /add task/i })[0]);
    fireEvent.change(screen.getByPlaceholderText("e.g. Brush teeth"), {
      target: { value: "Pack backpack" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: /backpack/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const updated = readState()[0].morning;
    const addedTask = updated.find((task) => task.title === "Pack backpack");

    expect(addedTask).toEqual(
      expect.objectContaining({
        title: "Pack backpack",
        icon: "backpack",
        completed: false,
      })
    );
  }, 10000);

  it("edits an existing task title and preserves its icon", () => {
    render(<Harness />);

    fireEvent.click(screen.getAllByRole("button", { name: "Brush teeth" })[0]);
    fireEvent.change(screen.getByDisplayValue("Brush teeth"), {
      target: { value: "Floss teeth" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const updated = readState()[0].morning.find((task) => task.id === "m2");
    expect(updated).toEqual(
      expect.objectContaining({
        title: "Floss teeth",
        icon: "brush",
        completed: false,
      })
    );
  });

  it("adds a task from the other-tasks bucket without opening the modal", () => {
    render(<Harness />);

    fireEvent.click(screen.getAllByRole("button", { name: /pack backpack/i })[0]);

    const updated = readState()[0].morning.find((task) => task.title === "Pack backpack");
    expect(updated).toEqual(
      expect.objectContaining({
        title: "Pack backpack",
        icon: "backpack",
        completed: false,
      })
    );
  });

  it("keeps the add-child affordance capped once the family has three children", () => {
    render(
      <Harness
        seedChildren={[
          ...initialChildren,
          {
            id: "child-3",
            name: "Ellie",
            morning: [],
            evening: [],
          },
        ]}
      />
    );

    expect(screen.queryByRole("button", { name: /add another child/i })).toBeNull();
  });

  it("shows the add-child affordance while the family is still below the cap", () => {
    render(<Harness />);

    expect(screen.getByRole("button", { name: /add another child/i })).toBeInTheDocument();
  });
});
