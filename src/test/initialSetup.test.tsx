import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { InitialSetup } from "@/components/InitialSetup";
import type { Child } from "@/lib/types";

vi.mock("@/components/ChildProfileAvatar", () => ({
  ChildProfileAvatar: ({ name }: { name?: string }) => <div>{name ?? "avatar"}</div>,
}));

const initialChildren: Child[] = [
  {
    id: "child-1",
    name: "Elie",
    age: 8,
    ageBucket: "6-8",
    avatarAnimal: "rabbit",
    avatarSeed: "seed-1",
    schedule: {
      morning: { start: "07:00", end: "09:00" },
      evening: { start: "17:00", end: "20:00" },
    },
    morning: [],
    evening: [],
  },
];

describe("InitialSetup", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("switches cleanly into the routines tab from the profile CTA", () => {
    render(<InitialSetup children={initialChildren} onComplete={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /go to routines/i }));

    expect(screen.getByText(/choose active routine tasks/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /morning/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /evening/i })).toBeInTheDocument();
  });
});
