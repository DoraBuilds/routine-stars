import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Index from "@/pages/Index";
import { CURRENT_LOCAL_APP_STATE_VERSION } from "@/lib/storage/local-app-state";
import type { Child } from "@/lib/types";

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

const { loadCloudHouseholdState } = vi.hoisted(() => ({
  loadCloudHouseholdState: vi.fn(),
}));
const { importLocalFamilyToCloud } = vi.hoisted(() => ({
  importLocalFamilyToCloud: vi.fn(),
}));
const { saveHouseholdConfigToCloud } = vi.hoisted(() => ({
  saveHouseholdConfigToCloud: vi.fn(),
}));
const { getSupabaseClient, upsertRoutineProgress, setTaskCompletion } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  upsertRoutineProgress: vi.fn(),
  setTaskCompletion: vi.fn(),
}));

vi.mock("@/lib/auth/use-auth", () => ({
  useAuth: () => authState,
}));

vi.mock("@/lib/data/cloud-household-state", () => ({
  loadCloudHouseholdState,
}));
vi.mock("@/lib/data/local-to-cloud-import", () => ({
  importLocalFamilyToCloud,
}));
vi.mock("@/lib/data/cloud-household-write", () => ({
  saveHouseholdConfigToCloud,
}));
vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient,
}));
vi.mock("@/lib/data/supabase-progress-repository", () => ({
  SupabaseProgressRepository: class {
    upsertRoutineProgress = upsertRoutineProgress;
    setTaskCompletion = setTaskCompletion;
  },
}));

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

vi.mock("@/components/AccountEntryScreen", () => ({
  AccountEntryScreen: ({
    onContinueLocalSetup,
  }: {
    onContinueLocalSetup: () => void;
  }) => (
    <div>
      <div data-testid="account-entry-screen">account-entry</div>
      <button type="button" onClick={onContinueLocalSetup}>
        continue-local-setup
      </button>
    </div>
  ),
}));

vi.mock("@/components/ImportFamilySetupScreen", () => ({
  ImportFamilySetupScreen: ({
    onImport,
    onStartFresh,
    isImporting,
    error,
  }: {
    onImport: () => void;
    onStartFresh: () => void;
    isImporting: boolean;
    error?: string | null;
  }) => (
    <div>
      <div data-testid="import-family-setup-screen">import-family-setup</div>
      <div data-testid="import-state">{String(isImporting)}</div>
      <div data-testid="import-error">{error ?? ""}</div>
      <button type="button" onClick={onImport}>
        import-family-setup
      </button>
      <button type="button" onClick={onStartFresh}>
        start-fresh-instead
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
    authState.configured = true;
    authState.status = "signed_out";
    authState.user = null;
    authState.householdStatus = "idle";
    authState.household = null;
    authState.error = null;
    loadCloudHouseholdState.mockReset();
    importLocalFamilyToCloud.mockReset();
    saveHouseholdConfigToCloud.mockReset();
    getSupabaseClient.mockReset();
    upsertRoutineProgress.mockReset();
    setTaskCompletion.mockReset();
    getSupabaseClient.mockReturnValue({});
    upsertRoutineProgress.mockResolvedValue({ id: "progress-1" });
    setTaskCompletion.mockResolvedValue({ id: "task-progress-1" });
    authState.clearError.mockReset();
    authState.sendEmailLink.mockReset();
    authState.retryHousehold.mockReset();
    authState.signOut.mockReset();
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
    expect(stored.version).toBe(CURRENT_LOCAL_APP_STATE_VERSION);
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

  it("shows the account entry flow when there is no saved data and no signed-in parent", async () => {
    render(<Index />);

    expect(await screen.findByTestId("account-entry-screen")).toBeInTheDocument();
  });

  it("lets a parent continue into local-only setup from the account entry flow", async () => {
    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "continue-local-setup" }));

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("0");
  });

  it("opens setup immediately on a fresh device when the parent is already signed in", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };

    render(<Index />);

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("0");
  });

  it("hydrates cloud household data on a fresh signed-in device", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [
        {
          id: "1",
          name: "Lily",
          morning: [{ id: "m1", title: "Make bed", icon: "bed", completed: false }],
          evening: [{ id: "e1", title: "Go to bed", icon: "moon-star", completed: false }],
        },
      ],
    });

    render(<Index />);

    expect(await screen.findByTestId("child-count")).toHaveTextContent("1");
    expect(loadCloudHouseholdState).toHaveBeenCalledWith(authState.household);
  });

  it("prefers cloud household state over stale local cache for signed-in households", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [
        {
          id: "1",
          name: "Cloud Lily",
          morning: [{ id: "m1", title: "Make bed", icon: "bed", completed: true }],
          evening: [],
        },
      ],
    });
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
      })
    );

    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "select-first-child" }));

    expect(await screen.findByTestId("active-child")).toHaveTextContent("Cloud Lily");
    expect(screen.getByTestId("first-task-completed")).toHaveTextContent("true");
  });

  it("shows an import decision when a signed-in device has local setup and cloud is empty", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [],
    });
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
        homeScene: "school",
      })
    );

    render(<Index />);

    expect(await screen.findByTestId("import-family-setup-screen")).toBeInTheDocument();
  });

  it("imports local setup into the cloud household when requested", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [],
    });
    importLocalFamilyToCloud.mockResolvedValue(undefined);
    loadCloudHouseholdState.mockResolvedValueOnce({
      homeScene: "kite",
      children: [],
    }).mockResolvedValueOnce({
      homeScene: "school",
      children: [
        {
          id: "1",
          name: "Lily",
          morning: [{ id: "m1", title: "Make bed", icon: "bed", completed: false }],
          evening: [{ id: "e1", title: "Go to bed", icon: "moon-star", completed: false }],
        },
      ],
    });
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
        homeScene: "school",
      })
    );

    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "import-family-setup" }));

    await waitFor(() => {
      expect(importLocalFamilyToCloud).toHaveBeenCalledWith(
        expect.objectContaining({
          household: authState.household,
          homeScene: "school",
        })
      );
    });

    expect(await screen.findByTestId("child-count")).toHaveTextContent("1");
  });

  it("syncs configuration changes to cloud after signed-in setup is completed", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [],
    });
    saveHouseholdConfigToCloud.mockResolvedValue(undefined);

    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "finish-setup" }));

    await waitFor(() => {
      expect(saveHouseholdConfigToCloud).toHaveBeenCalledWith(
        expect.objectContaining({
          household: authState.household,
          removeMissingChildren: true,
        })
      );
    });
  });

  it("lets a parent start fresh instead of importing existing local setup", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [],
    });
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify({
        ...createStoredState(false, today()),
        setupComplete: true,
      })
    );

    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "start-fresh-instead" }));

    expect(await screen.findByTestId("setup-child-count")).toHaveTextContent("0");
  });

  it("syncs signed-in task toggles to cloud-backed progress", async () => {
    authState.status = "signed_in";
    authState.user = { id: "user-1", email: "parent@example.com" };
    authState.householdStatus = "ready";
    authState.household = {
      id: "house-1",
      name: "Routine Stars Family",
      timezone: "Europe/Madrid",
      homeScene: "kite",
      createdByUserId: "user-1",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    };
    loadCloudHouseholdState.mockResolvedValue({
      homeScene: "kite",
      children: [
        {
          id: "1",
          name: "Lily",
          morning: [{ id: "m1", title: "Make bed", icon: "bed", completed: false }],
          evening: [],
          schedule: {
            morning: { start: "00:00", end: "23:59" },
            evening: { start: "00:00", end: "00:01" },
          },
        },
      ],
    });

    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "select-first-child" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-first-task" }));

    await waitFor(() => {
      expect(upsertRoutineProgress).toHaveBeenCalled();
      expect(setTaskCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          dailyRoutineProgressId: "progress-1",
          routineTaskId: "m1",
          completed: true,
        })
      );
    });
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

  it("hydrates legacy unversioned local data", async () => {
    localStorage.setItem(
      "routine_stars_data",
      JSON.stringify(createStoredState(false, today()))
    );

    render(<Index />);

    fireEvent.click(screen.getByRole("button", { name: "select-first-child" }));

    expect(await screen.findByTestId("active-child")).toHaveTextContent("Lily");
  });

  it("completes first-run setup and persists the configured routines", async () => {
    render(<Index />);

    fireEvent.click(await screen.findByRole("button", { name: "continue-local-setup" }));
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
