import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "./Button";
describe("Button", () => {
    it("renders its children", () => {
        render(_jsx(Button, { children: "Save" }));
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
    it("invokes onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(_jsx(Button, { onClick: onClick, children: "Save" }));
        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it("does not invoke onClick when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(_jsx(Button, { onClick: onClick, disabled: true, children: "Save" }));
        await user.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });
    it("forwards ref to the underlying button element", () => {
        const ref = createRef();
        render(_jsx(Button, { ref: ref, children: "Save" }));
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
    it("spreads rest props onto the root element", () => {
        render(_jsx(Button, { "data-testid": "save", "aria-describedby": "hint", children: "Save" }));
        const btn = screen.getByTestId("save");
        expect(btn).toHaveAttribute("aria-describedby", "hint");
    });
    it("suppresses click while loading", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(_jsx(Button, { onClick: onClick, loading: true, children: "Save" }));
        await user.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });
});
