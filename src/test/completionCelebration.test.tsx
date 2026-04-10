import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CompletionCelebration } from "@/components/CompletionCelebration";

const { confettiMock, balloonsMock } = vi.hoisted(() => ({
  confettiMock: vi.fn(),
  balloonsMock: vi.fn(() => Promise.resolve()),
}));

vi.mock("canvas-confetti", () => ({
  default: confettiMock,
}));

vi.mock("balloons-js", () => ({
  balloons: balloonsMock,
}));

describe("CompletionCelebration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    confettiMock.mockClear();
    balloonsMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires the task confetti burst and closes automatically", () => {
    const onFinish = vi.fn();

    render(<CompletionCelebration variant="task" childName="Lily" onFinish={onFinish} />);

    expect(screen.queryByRole("status")).toBeNull();
    expect(confettiMock).toHaveBeenCalledTimes(5);
    expect(balloonsMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("shows the routine celebration message and launches balloons", () => {
    const onFinish = vi.fn();

    render(<CompletionCelebration variant="routine" childName="Lily" onFinish={onFinish} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("All done, Lily!")).toBeInTheDocument();
    expect(confettiMock).toHaveBeenCalledTimes(5);
    expect(balloonsMock).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
