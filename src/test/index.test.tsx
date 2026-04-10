import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Index from "@/pages/Index";
import type { Child } from "@/lib/types";

const today = () => new Date().toDateString();

const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toDateString();
};

vi.mock("@/components/ChildSelector", () => ({
  ChildSelector: ({
    children,
    onSelectChild,
    onOpenSettings,
  }: {
    children: Array<{ id: string; name: string }>;
    onSelectChild: (id: string) => void;
    onOpenSettings: () => void;
  }) => (
    <div>
      <div data-testid="child-count">{children.length}</div>
      <button type="button" onClick={() => onSelectChild(children[0].id)}>
        select-first-child
      </button>
      <button type="button" onClick={onOpenSettings}>
        open-settings
      </button>
    </div>
  ),
}));

vi.mock("@/components/RoutineView", () => ({
  RoutineView: ({
    child,
    routine,
    onToggleTask,
    onBack,
  }: {
    child: { name: string; morning: Array<{ id: string; completed: boolean }> };
    routine: "morning" | "evening";
    onToggleTask: (taskId: string) => void;
    onBack: () => void;
  }) => (
    <div>
      <div data-testid="active-child">{child.name}</div>
      <div data-testid="active-routine">{routine}</div>
      <div data-testid="first-task-completed">
        {String(child[routine][0]?.completed ?? false)}
      </div>
      <button type="button" onClick={() => onToggleTask(child[routine][0].id)}>
        toggle-first-task
      </button>
      <button type="button" onClick={onBack}>
        back-home
      </button>
    </div>
  ),
}));

vi.mock("@/components/ParentSettings", () => ({
  ParentSettings: ({
    onBack,
    onRestartSetup,
    onResetAppData,
  }: {
    onBack: () => void;
    onRestartSetup: () => void;
    onResetAppData: () => void;
  }) => (
    <div>
      <button type="button" onClick={onBack}>
        back-home
      </button>
      <button type="button" onClick={onRestartSetup}>
        restart-setup
      </button>
      <button type="button" onClick={onResetAppData}>
        reset-app-data
      </button>
    </div>
  ),
}));

vi.mock("@/components/InitialSetup", () => ({
  InitialSetup: ({
    children,
    onComplete,
  }: {
    children: Child[];
    onComplete: (children: Child[]) => void;
  }) => (
    <div>
      <div data-testid="setup-child-count">{children.length}</div>
      <button
        type="button"
        onClick={() =>
          onComplete([
            {
              id: "1",
              name: "Lily",
              morning: [{ id: "m1", title: "Make bed", icon: "bed", completed: false }],
              evening: [{ id: "e1", title: "Go to bed", icon: "moon-star", completed: false }],
            },
          ])
        }
      >
        finish-setup
      </button>
    </div>
  ),
}));

const createStoredState = (completed: boolean, lastReset: string) => ({
  children: [
    {
      id: "1",
      name: "Lily",
      morning: [
        { id: "m1", title: "Make bed", icon: "bed", completed },
        { id: "m2", title: "Brush teeth", icon: "brush", completed: false },
      ],
      evening: [],
    },
  ],
  lastReset,
});

describe("Index", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("resets completed tasks when stored data is from a previous day", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify(createStoredState(true, yesterday()))
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "select-first-child" }));

    expect(await screen.findByTestId("active-child")).toHaveTextContent("Lily");
    expect(screen.getByTestId("first-task-completed")).toHaveTextContent("false");
  });

  it("persists task toggles back to localStorage for the current day", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify(createStoredState(false, today()))
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "select-first-child" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-first-task" }));

    await waitFor(() => {
      expect(screen.getByTestId("first-task-completed")).toHaveTextContent("true");
    });

    const stored = JSON.parse(localStorage.getItem("routine_stars_data") ?? "{}");
    expect(stored.lastReset).toBe(today());
    expect(stored.children[0].morning[0].completed).toBe(true);
  });

  it("opens the due routine for the active child view", () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        children: [
          {
            id: "1",
            name: "Lily",
            morning: [
              { id: "m1", title: "Make bed", icon: "bed", completed: false },
            ],
            evening: [
              { id: "e1", title: "Go to bed", icon: "moon-star", completed: false },
            ],
            schedule: {
              morning: { start: "00:00", end: "00:01" },
              evening: { start: "00:02", end: "23:59" },
            },
          },
        ],
      })
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "select-first-child" }));

    expect(screen.getByTestId("active-routine")).toHaveTextContent("evening");
  });

  it("shows the initial setup flow when there is no saved data", async () => {
    render(<Index />);

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("0");
  });

  it("re-opens setup when saved data is marked incomplete", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: false,
      })
    );

    render(<Index />);

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("1");
  });

  it("completes first-run setup and persists the configured routines", async () => {
    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "finish-setup" }));

    expect(await screen.findByTestId("child-count")).toHaveTextContent("1");

    const stored = JSON.parse(localStorage.getItem("routine_stars_data") ?? "{}");
    expect(stored.setupComplete).toBe(true);
    expect(stored.children).toHaveLength(1);
    expect(stored.children[0].morning[0].title).toBe("Make bed");
  });

  it("lets a parent clear app data from Parent Settings", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
        homeScene: "kite",
      })
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "open-settings" }));
    fireEvent.click(screen.getByRole("button", { name: "reset-app-data" }));

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("0");

    const stored = JSON.parse(localStorage.getItem("routine_stars_data") ?? "{}");
    expect(stored.setupComplete).toBe(false);
    expect(stored.children).toEqual([]);
    expect(stored.homeScene).toBe("bike");
  });

  it("lets a parent restart setup without manual localStorage edits", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
      })
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "open-settings" }));
    fireEvent.click(screen.getByRole("button", { name: "restart-setup" }));

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("1");

    const stored = JSON.parse(localStorage.getItem("routine_stars_data") ?? "{}");
    expect(stored.setupComplete).toBe(false);
    expect(stored.children).toHaveLength(1);
    expect(stored.children[0].name).toBe("Lily");
  });
});
