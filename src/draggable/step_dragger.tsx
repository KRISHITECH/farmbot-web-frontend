import { addGhostImage } from "./add_ghost_image";
import * as React from "react";
import { stepPut } from "./actions";
import { CeleryNode as Step } from "../sequences/corpus";
import { DataXferIntent } from "./interfaces";

/** Magic number to indicate that the draggerId was not provided or can't be
 *  known. */
export const NULL_DRAGGER_ID = 0xCAFEF00D;

/** This is an event handler that:
 * 1. Adds an optional CSS class to the dragged "ghost image".
 * 2. Puts the step into the Redux store (and the drag event's dataTransfer)
 *    so that it can be pulled up when the "drop" event happens.
 * Example usage:
 *
 * <button draggable={true}
 *         onDragStart={stepDragEventHandler(dispatch, step, "optnl-stuff")} >
 *   Drag this!
 * </button>
 * */
export let stepDragEventHandler = (dispatch: Function,
    step: Step,
    ghostCss = "",
    intent: DataXferIntent,
    draggerId: number) =>
    (ev: React.DragEvent<HTMLElement>) => {
        addGhostImage(ev, ghostCss);
        dispatch(stepPut(step, ev, intent, draggerId));
    };

interface StepDraggerProps {
    dispatch: Function;
    step: Step;
    intent: DataXferIntent;
    ghostCss: string;
    children?: JSX.Element | undefined;
    draggerId: number;
}

export function StepDragger({dispatch,
    step,
    children,
    ghostCss,
    intent,
    draggerId}: StepDraggerProps) {
    return <div draggable={true}
        onDragStart={stepDragEventHandler(dispatch,
            step,
            ghostCss,
            intent,
            draggerId)} >
        {children}
    </div>;
}
