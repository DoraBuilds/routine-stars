import { createElement, useState } from "react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ParentSettings } from "@/components/ParentSettings";
import type { Child, HomeScene } from "@/lib/types";

const authState = {
  configured: true,
  status: "signed_out",
  user: null,
  householdStatus: "idle",
  household: null,
  error: null,
  clearError: vi.fn(),
  sendEmailLink: vi.fn(),
  retryHousehold: vi.fn(),
  signOut: vi.fn(),
};

vi.mock("@/lib/auth/use-auth", () => ({
  useAuth: () => authState,
}));

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

const Harness = ({
  seedChildren = initialChildren,
  pendingCloudProgressSync = false,
}: {
  seedChildren?: Child[];
  pendingCloudProgressSync?: boolean;
}) => {
  const [children, setChildren] = useState(seedChildren);
  const [homeScene, setHomeScene] = useState<HomeScene>("bike");
  const [restartCount, setRestartCount] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  return (
    <div>
      <pre data-testid="state">{JSON.stringify(children)}</pre>
      <div data-testid="restart-count">{restartCount}</div>
      <div data-testid="reset-count">{resetCount}</div>
      <ParentSettings
        children={children}
        homeScene={homeScene}
        pendingCloudProgressSync={pendingCloudProgressSync}
        onChange={setChildren}
        onHomeSceneChange={setHomeScene}
        onRestartSetup={() => setRestartCount((count) => count + 1)}
        onResetAppData={() => setResetCount((count) => count + 1)}
        onBack={() => {}}
      />
    </div>
  );
};

describe("ParentSettings", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    authState.status = "signed_out";
    authState.user = null;
    authState.signOut.mockReset();
    authState.clearError.mockReset();
    authState.sendEmailLink.mockReset();
    authState.retryHousehold.mockReset();
  });

  it("renames a child in place", () => {
    render(<Harness />);

    const nameInput = screen.getByDisplayValue("Lily");
    fireEvent.change(nameInput, { target: { value: "LUNA" } });

    expect(readState()[0].name).toBe("LUNA");
  });

  it("adds a task with the selected icon and default completion state", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /routines/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /routines/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /routines/i }));
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

  it("keeps age buckets collapsed by default in the routine editor", () => {
    const { container } = render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /routines/i }));
    const firstBucket = container.querySelector("details");
    expect(firstBucket).not.toBeNull();
    expect(firstBucket).not.toHaveAttribute("open");
  });

  it("shows restart and reset controls for the parent", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /admin/i }));
    expect(screen.getByRole("button", { name: /restart setup/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^reset everything$/i })).toBeInTheDocument();
  });

  it("requires confirmation before resetting all app data", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /admin/i }));
    fireEvent.click(screen.getByRole("button", { name: /^reset everything$/i }));

    expect(screen.getByText(/this clears everything saved in this browser/i)).toBeInTheDocument();
    expect(screen.getByTestId("reset-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByRole("button", { name: /yes, reset everything/i }));

    expect(screen.getByTestId("reset-count")).toHaveTextContent("1");
  });

  it("fires restart setup without clearing the current children immediately", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: /admin/i }));
    fireEvent.click(screen.getByRole("button", { name: /restart setup/i }));

    expect(screen.getByTestId("restart-count")).toHaveTextContent("1");
    expect(readState()).toHaveLength(2);
  });

  it("shows a calm local-only sync status when no parent is signed in", () => {
    render(<Harness />);

    expect(screen.getByText(/this device is local-only right now/i)).toBeInTheDocument();
  });

  it("shows a pending sync status when this device still has offline progress to flush", () => {
    authState.status = "signed_in";

    render(<Harness pendingCloudProgressSync />);

    expect(screen.getByText(/this device still has progress waiting to sync/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we will keep trying quietly in the background/i)
    ).toBeInTheDocument();
  });
});
