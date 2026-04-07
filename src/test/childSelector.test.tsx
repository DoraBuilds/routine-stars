import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ChildSelector } from "@/components/ChildSelector";
import type { Child } from "@/lib/types";

const children: Child[] = [
  {
    id: "child-1",
    name: "Lily",
    age: 5,
    ageBucket: "4-6",
    avatarAnimal: "bunny",
    schedule: {
      morning: { start: "07:00", end: "09:00" },
      evening: { start: "17:00", end: "20:00" },
    },
    morning: [],
    evening: [],
  },
];

describe("ChildSelector parent gate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not open settings on a quick press", () => {
    const onOpenSettings = vi.fn();

    render(
      <ChildSelector
        children={children}
        globalTheme="free"
        homeScene="bike"
        dueRoutineByChild={{ "child-1": null }}
        onSelectChild={() => {}}
        onOpenSettings={onOpenSettings}
      />
    );

    const button = screen.getByRole("button", {
      name: "Press and hold to open Parent Settings",
    });

    fireEvent.pointerDown(button);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.pointerUp(button);

    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  it("opens settings after a full hold", () => {
    const onOpenSettings = vi.fn();

    render(
      <ChildSelector
        children={children}
        globalTheme="free"
        homeScene="bike"
        dueRoutineByChild={{ "child-1": null }}
        onSelectChild={() => {}}
        onOpenSettings={onOpenSettings}
      />
    );

    const button = screen.getByRole("button", {
      name: "Press and hold to open Parent Settings",
    });

    fireEvent.pointerDown(button);
    act(() => {
      vi.advanceTimersByTime(1250);
    });

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
