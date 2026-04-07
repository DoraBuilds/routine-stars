import { describe, expect, it } from "vitest";
import { AGE_BUCKETS, DEFAULT_CHILDREN, groupTasksByAge, ICON_OPTIONS, TASK_LIBRARY } from "@/lib/types";

const iconKeys = new Set(ICON_OPTIONS.map((option) => option.key));

describe("task catalog defaults", () => {
  it("keeps the initial family profile set complete and stable", () => {
    expect(DEFAULT_CHILDREN).toHaveLength(3);
    expect(new Set(DEFAULT_CHILDREN.map((child) => child.id)).size).toBe(3);
    expect(new Set(DEFAULT_CHILDREN.map((child) => child.name)).size).toBe(3);
  });

  it("ships tasks with valid icon coverage and clean default state", () => {
    for (const child of DEFAULT_CHILDREN) {
      expect(child.name).toBeTruthy();

      for (const routine of [child.morning, child.evening]) {
        expect(new Set(routine.map((task) => task.id)).size).toBe(routine.length);

        for (const task of routine) {
          expect(task.title).toBeTruthy();
          expect(task.completed).toBe(false);
          expect(iconKeys.has(task.icon)).toBe(true);
        }
      }
    }
  });

  it("exposes the child-friendly icon palette used by parent editing", () => {
    expect(ICON_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "bed", label: "Bed" }),
        expect.objectContaining({ key: "brush", label: "Brush" }),
        expect.objectContaining({ key: "moon-star", label: "Bedtime" }),
        expect.objectContaining({ key: "package-open", label: "Put away" }),
      ])
    );
  });

  it("organizes catalog suggestions into age buckets so setup stays manageable", () => {
    expect(AGE_BUCKETS.map((bucket) => bucket.key)).toEqual(["2-4", "4-6", "6-8"]);

    for (const task of TASK_LIBRARY) {
      expect(task.ages.length).toBeGreaterThan(0);
    }

    const grouped = groupTasksByAge(TASK_LIBRARY);
    expect(grouped).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "2-4" }),
        expect.objectContaining({ key: "4-6" }),
        expect.objectContaining({ key: "6-8" }),
      ])
    );
  });

  it("includes household helper tasks for older children in the catalog", () => {
    expect(TASK_LIBRARY).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "unload-dishwasher", ages: expect.arrayContaining(["6-8"]) }),
        expect.objectContaining({ id: "fold-clothes", ages: expect.arrayContaining(["6-8"]) }),
        expect.objectContaining({ id: "help-sibling-homework", ages: expect.arrayContaining(["6-8"]) }),
      ])
    );
  });
});
