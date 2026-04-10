import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RoutineView } from "@/components/RoutineView";
import type { Child } from "@/lib/types";

vi.mock("@/components/CompletionCelebration", () => ({
  CompletionCelebration: ({
    variant,
    childName,
    onFinish,
  }: {
    variant: "task" | "routine";
    childName: string;
    onFinish: () => void;
  }) => (
    <div data-testid="celebration">
      <span>{variant}</span>
      <span>{childName}</span>
      <button type="button" onClick={onFinish}>
        finish-celebration
      </button>
    </div>
  ),
}));

const child: Child = {
  id: "child-1",
  name: "Lily",
  age: 5,
  ageBucket: "4-6",
  avatarAnimal: "bunny",
  schedule: {
    morning: { start: "07:00", end: "09:00" },
    evening: { start: "17:00", end: "20:00" },
  },
  morning: [
    { id: "m1", title: "Use the toilet", icon: "sparkles", completed: false },
    { id: "m2", title: "Brush teeth", icon: "brush", completed: false },
  ],
  evening: [
    { id: "e1", title: "Put on pajamas", icon: "shirt", completed: false },
  ],
};

describe("RoutineView child-facing copy", () => {
  it("shows a simple morning routine heading and task labels", () => {
    render(<RoutineView child={child} routine="morning" onToggleTask={() => {}} onBack={() => {}} />);

    expect(screen.getByRole("heading", { name: "Good Morning, Lily!" })).toBeInTheDocument();
    expect(screen.getByText("Morning routine")).toBeInTheDocument();
    expect(screen.getByText("Tap the cards")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Use the toilet/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Brush teeth/i })).toBeInTheDocument();
  });

  it("shows a simple evening routine heading and bedtime copy", () => {
    render(<RoutineView child={child} routine="evening" onToggleTask={() => {}} onBack={() => {}} />);

    expect(screen.getByRole("heading", { name: "Good Evening, Lily!" })).toBeInTheDocument();
    expect(screen.getByText("Evening routine")).toBeInTheDocument();
    expect(screen.getByText("Tap the cards")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Put on pajamas/i })).toBeInTheDocument();
  });

  it("surfaces a child-friendly celebration when a task is tapped", () => {
    const onToggleTask = vi.fn();

    render(<RoutineView child={child} routine="morning" onToggleTask={onToggleTask} onBack={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Use the toilet/i }));

    expect(onToggleTask).toHaveBeenCalledWith("m1");
    expect(screen.getByTestId("celebration")).toHaveTextContent("task");
    expect(screen.getByTestId("celebration")).toHaveTextContent("Lily");
  });
});
