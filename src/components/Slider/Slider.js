import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { cn } from "../../lib/cn";
const TYPE_TOKENS = {
    primary: {
        fill: "var(--color-primary-color)",
        track: "var(--color-primary-selected-color)",
        thumbBorder: "var(--color-primary-color)",
        iconText: "var(--color-primary-color)",
    },
    negative: {
        fill: "var(--color-negative-color)",
        track: "var(--color-negative-color-selected)",
        thumbBorder: "var(--color-negative-color)",
        iconText: "var(--color-negative-color)",
    },
    positive: {
        fill: "var(--color-positive-color)",
        track: "var(--color-positive-color-selected)",
        thumbBorder: "var(--color-positive-color)",
        iconText: "var(--color-positive-color)",
    },
};
const SIZE_TOKENS = {
    sm: { trackHeightPx: 2, thumbPx: 16, thumbActivePx: 20, labelText: "text-t3", iconPx: 16 },
    md: { trackHeightPx: 4, thumbPx: 20, thumbActivePx: 24, labelText: "text-t2", iconPx: 20 },
    lg: { trackHeightPx: 6, thumbPx: 24, thumbActivePx: 30, labelText: "text-t2", iconPx: 24 },
};
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const roundToStep = (n, step, min) => {
    if (step <= 0)
        return n;
    const offset = n - min;
    const rounded = Math.round(offset / step) * step;
    // Avoid floating point drift like 0.30000000000000004 by snapping to step precision.
    const decimals = (step.toString().split(".")[1] ?? "").length;
    return Number((rounded + min).toFixed(decimals));
};
const isRange = (v) => Array.isArray(v) && v.length === 2;
const toTuple = (v) => (isRange(v) ? v : [v, v]);
const defaultFormat = (v) => `${v}%`;
export const Slider = forwardRef(function Slider({ className, value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, type = "primary", size = "md", disabled = false, showLabel = false, tooltip = true, formatLabel = defaultFormat, startIcon, endIcon, name, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...rest }, ref) {
    const isControlled = value !== undefined;
    const initial = useMemo(() => {
        if (isControlled)
            return value;
        if (defaultValue !== undefined)
            return defaultValue;
        return min;
    }, [isControlled, value, defaultValue, min]);
    const rangeMode = isRange(initial);
    const [internal, setInternal] = useState(initial);
    const current = isControlled ? value : internal;
    const trackRef = useRef(null);
    const thumbRefs = useRef([null, null]);
    const [activeThumb, setActiveThumb] = useState(null);
    const tokens = TYPE_TOKENS[type];
    const sizeTokens = SIZE_TOKENS[size];
    const [lo, hi] = toTuple(current);
    const loPct = max === min ? 0 : ((clamp(lo, min, max) - min) / (max - min)) * 100;
    const hiPct = max === min ? 0 : ((clamp(hi, min, max) - min) / (max - min)) * 100;
    const fillStartPct = rangeMode ? loPct : 0;
    const fillEndPct = rangeMode ? hiPct : loPct;
    const commitValue = useCallback((next, kind) => {
        if (!isControlled)
            setInternal(next);
        if (kind === "change")
            onValueChange?.(next);
        else
            onValueCommit?.(next);
    }, [isControlled, onValueChange, onValueCommit]);
    const updateAt = useCallback((idx, raw, kind) => {
        const snapped = clamp(roundToStep(raw, step, min), min, max);
        let next;
        if (rangeMode) {
            const tuple = toTuple(current);
            const other = idx === 0 ? tuple[1] : tuple[0];
            // Allow thumbs to cross — the lower / upper roles swap via Math.min/max.
            const a = idx === 0 ? snapped : other;
            const b = idx === 0 ? other : snapped;
            next = [Math.min(a, b), Math.max(a, b)];
        }
        else {
            next = snapped;
        }
        commitValue(next, kind);
    }, [commitValue, current, max, min, rangeMode, step]);
    // Convert a clientX into a raw value (un-snapped, un-clamped beyond bounds).
    const valueFromClientX = useCallback((clientX) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0)
            return min;
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        return min + ratio * (max - min);
    }, [max, min]);
    const closestThumbTo = useCallback((raw) => {
        if (!rangeMode)
            return 0;
        const tuple = toTuple(current);
        // If a thumb is active (drag started on it) the caller passes that index;
        // otherwise pick whichever thumb sits closer to the click position.
        return Math.abs(raw - tuple[0]) <= Math.abs(raw - tuple[1]) ? 0 : 1;
    }, [current, rangeMode]);
    const onTrackPointerDown = useCallback((e) => {
        if (disabled)
            return;
        // Ignore right-click / middle-click.
        if (e.button !== 0 && e.pointerType === "mouse")
            return;
        e.preventDefault();
        const raw = valueFromClientX(e.clientX);
        const idx = closestThumbTo(raw);
        setActiveThumb(idx);
        thumbRefs.current[idx]?.focus({ preventScroll: true });
        updateAt(idx, raw, "change");
    }, [closestThumbTo, disabled, updateAt, valueFromClientX]);
    // Pointer drag: attach to window so it keeps tracking when the cursor leaves the track.
    useEffect(() => {
        if (activeThumb === null)
            return;
        const onMove = (e) => {
            const raw = valueFromClientX(e.clientX);
            updateAt(activeThumb, raw, "change");
        };
        const onUp = () => {
            const tuple = toTuple(current);
            onValueCommit?.(rangeMode ? tuple : tuple[0]);
            setActiveThumb(null);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, [activeThumb, current, onValueCommit, rangeMode, updateAt, valueFromClientX]);
    const onThumbKeyDown = useCallback((idx) => (e) => {
        if (disabled)
            return;
        const tuple = toTuple(current);
        const v = tuple[idx];
        const big = Math.max(step, (max - min) / 10);
        let next = v;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                next = v + step;
                break;
            case "ArrowLeft":
            case "ArrowDown":
                next = v - step;
                break;
            case "PageUp":
                next = v + big;
                break;
            case "PageDown":
                next = v - big;
                break;
            case "Home":
                next = min;
                break;
            case "End":
                next = max;
                break;
            default:
                return;
        }
        e.preventDefault();
        updateAt(idx, next, "change");
        onValueCommit?.(rangeMode ? toTuple(current) : v);
    }, [current, disabled, max, min, onValueCommit, rangeMode, step, updateAt]);
    const renderThumb = (idx) => {
        const tuple = toTuple(current);
        const v = tuple[idx];
        const pct = max === min ? 0 : ((clamp(v, min, max) - min) / (max - min)) * 100;
        const isActive = activeThumb === idx;
        // Per Figma: Regular = baseline size, Hover = baseline + tooltip, Clicked = larger + tooltip.
        // The handle stays hollow (white fill, coloured border) in all three states; only the
        // outer diameter changes between Regular/Hover (baseline) and Clicked (active drag).
        const dim = isActive ? sizeTokens.thumbActivePx : sizeTokens.thumbPx;
        const tooltipText = formatLabel(v);
        return (_jsx("div", { ref: (el) => {
                thumbRefs.current[idx] = el;
            }, role: "slider", tabIndex: disabled ? -1 : 0, "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": v, "aria-valuetext": tooltipText, "aria-orientation": "horizontal", "aria-disabled": disabled || undefined, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, onKeyDown: onThumbKeyDown(idx), onPointerDown: (e) => {
                if (disabled)
                    return;
                if (e.button !== 0 && e.pointerType === "mouse")
                    return;
                e.preventDefault();
                e.currentTarget.focus({ preventScroll: true });
                setActiveThumb(idx);
            }, className: cn("group absolute top-1/2 rounded-full", "border-[3px] transition-[width,height,box-shadow] duration-[120ms] ease-out", "-translate-x-1/2 -translate-y-1/2", 
            // No custom focus ring — Figma doesn't have one. Keyboard users still get
            // the browser-default outline on focus-visible, which preserves a11y.
            "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2", disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing"), style: {
                left: `${pct}%`,
                width: `${dim}px`,
                height: `${dim}px`,
                borderColor: tokens.thumbBorder,
                color: tokens.thumbBorder,
                backgroundColor: "var(--color-primary-background-color)",
                // Active thumb halo: the Figma "Clicked" state has a soft brand-coloured
                // drop shadow under the (still hollow) handle. Mix currentColor with transparent
                // so each type (primary/negative/positive) glows in its own hue.
                boxShadow: isActive
                    ? "0 4px 8px 0 color-mix(in oklab, currentColor 30%, transparent)"
                    : undefined,
            }, "data-state": isActive ? "active" : "idle", "data-thumb-index": idx, children: tooltip && !disabled && (_jsxs("div", { role: "presentation", className: cn("pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5", "flex flex-col items-center", "opacity-0 transition-opacity duration-[120ms] ease-out", "group-data-[state=active]:opacity-100"), children: [_jsx("div", { className: cn("rounded-sm px-4 py-2 whitespace-nowrap font-body text-t2", "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]", "tabular-nums shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]"), children: tooltipText }), _jsx("div", { "aria-hidden": "true", className: "size-0 border-x-8 border-x-transparent border-t-8", style: { borderTopColor: "var(--color-inverted-color-background)" } })] })) }, idx));
    };
    const reservedThumbSpace = sizeTokens.thumbActivePx;
    // Reserve enough room on either side of the track for the largest thumb size
    // so the thumb never clips off the slider's bounding box.
    const trackInsetStyle = {
        paddingLeft: `${reservedThumbSpace / 2}px`,
        paddingRight: `${reservedThumbSpace / 2}px`,
    };
    const labelLeft = rangeMode ? formatLabel(lo) : null;
    const labelRight = formatLabel(rangeMode ? hi : lo);
    const labelBox = (text) => (_jsx("div", { className: cn("shrink-0 inline-flex items-center justify-center text-center select-none", "rounded-sm border border-[var(--color-ui-border-color)] bg-[var(--color-primary-background-color)]", "h-8 px-2 min-w-[60px]", sizeTokens.labelText, "text-[var(--color-secondary-text-color)] font-body tabular-nums", disabled && "opacity-60"), children: text }));
    const iconWrap = (node) => (_jsx("span", { className: "shrink-0 inline-flex items-center justify-center", style: {
            color: disabled ? "var(--color-disabled-text-color)" : tokens.iconText,
            width: `${sizeTokens.iconPx}px`,
            height: `${sizeTokens.iconPx}px`,
        }, "aria-hidden": "true", children: node }));
    // Hidden form inputs so the slider participates in native form submission.
    const hiddenInputs = name && !disabled ? (rangeMode ? (_jsxs(_Fragment, { children: [_jsx("input", { type: "hidden", name: `${name}[]`, value: lo }), _jsx("input", { type: "hidden", name: `${name}[]`, value: hi })] })) : (_jsx("input", { type: "hidden", name: name, value: lo }))) : null;
    return (_jsxs("div", { ref: ref, className: cn("inline-flex w-full items-center gap-3", className), "data-disabled": disabled || undefined, ...rest, children: [startIcon != null && iconWrap(startIcon), showLabel && rangeMode && labelLeft != null && labelBox(labelLeft), _jsx("div", { className: "relative flex-1 min-w-0 flex items-center", style: { height: `${sizeTokens.thumbActivePx}px`, ...trackInsetStyle }, children: _jsxs("div", { ref: trackRef, onPointerDown: onTrackPointerDown, className: cn("relative w-full rounded-full", disabled ? "cursor-not-allowed" : "cursor-pointer"), style: {
                        height: `${sizeTokens.trackHeightPx}px`,
                        backgroundColor: disabled ? "var(--color-disabled-background-color)" : tokens.track,
                    }, "data-state": activeThumb !== null ? "dragging" : "idle", children: [_jsx("div", { className: "absolute top-0 h-full rounded-full", style: {
                                left: `${fillStartPct}%`,
                                width: `${Math.max(0, fillEndPct - fillStartPct)}%`,
                                backgroundColor: disabled
                                    ? "var(--color-disabled-text-color)"
                                    : tokens.fill,
                                transition: activeThumb === null ? "left 120ms ease-out, width 120ms ease-out" : "none",
                            } }), renderThumb(0), rangeMode && renderThumb(1)] }) }), showLabel && labelBox(labelRight), endIcon != null && iconWrap(endIcon), hiddenInputs] }));
});
Slider.displayName = "Slider";
