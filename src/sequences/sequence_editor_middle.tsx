import * as React from "react";
import { Step as IStep, Sequence } from "./interfaces";
import { execSequence } from "../devices/actions";
import {
    editCurrentSequence,
    saveSequence,
    deleteSequence,
    nullSequence
} from "./actions";
import { stepTiles, StepTile } from "./step_tiles/index";
import { Everything } from "../interfaces";
import { ColorPicker } from "./color_picker";
import { t } from "i18next";
import { BlurableInput } from "../ui";
import { DropArea } from "../draggable/drop_area";
import { stepGet } from "../draggable/actions";
import { StepMoveDataXfer, StepSpliceDataXfer } from "../draggable/interfaces";
import { pushStep, spliceStep, moveStep, removeStep } from "./actions";
import { StepDragger, NULL_DRAGGER_ID } from "../draggable/step_dragger";
import { copySequence } from "./actions";

let Oops: StepTile = (_) => {
    return <div>Whoops! Not a valid message_type</div>;
};

type DataXferObj = StepMoveDataXfer | StepSpliceDataXfer;
type dispatcher = (a: Function | { type: string }) => DataXferObj;
function routeIncomingDroppedItems(dispatch: dispatcher,
    key: string,
    dropperId: number) {
    let dataXferObj = dispatch(stepGet(key));
    let step = dataXferObj.value;
    switch (dataXferObj.intent) {
        case "step_splice":
            return dispatch(spliceStep(step, dropperId));
        case "step_move":
            let {draggerId} = dataXferObj;
            return dispatch(moveStep(step, draggerId, dropperId));
        default:
            console.dir(dataXferObj);
            throw new Error("Got unexpected data transfer object.");
    }
}

let onDrop = (dispatch: dispatcher, dropperId: number) => (key: string) => {
    routeIncomingDroppedItems(dispatch, key, dropperId);
};

let StepList = ({sequence, sequences, dispatch}:
    { sequence: Sequence, sequences: Sequence[], dispatch: Function }) => {
    return (<div>
        {sequence.body.map((step: IStep, inx: number) => {
            let Step = stepTiles[step.kind] || Oops;
            return <div key={inx}>
                <DropArea callback={onDrop(dispatch as dispatcher, inx)} />
                <StepDragger dispatch={dispatch}
                    step={step}
                    ghostCss="step-drag-ghost-image-big"
                    intent="step_move"
                    draggerId={inx}>
                    <Step step={step}
                        index={inx}
                        dispatch={dispatch}
                        sequence={sequence}
                        sequences={sequences} />
                </StepDragger>
            </div>;
        })}
    </div>);
};

let handleNameUpdate = (dispatch: Function) =>
    (event: React.SyntheticEvent<HTMLInputElement>) => {
        let name: string = (event.currentTarget).value || "";
        dispatch(editCurrentSequence({ name }));
    };

let save = function(dispatch: Function, sequence: Sequence) {
    return (e: React.SyntheticEvent<HTMLButtonElement>) => {
        dispatch(saveSequence(sequence));
    };
};

let copy = function(dispatch: Function, sequence: Sequence) {
    return (e: React.SyntheticEvent<HTMLButtonElement>) =>
        dispatch(copySequence(sequence));
};

let destroy = function(dispatch: Function,
    sequence: Sequence,
    inx: number) {
    return () => dispatch(deleteSequence(inx));
};

export let performSeq = (dispatch: Function, s: Sequence) => {
    return () => {
        dispatch(saveSequence(s, false))
            .then(() => execSequence(s));
    };
};

export function SequenceEditorMiddle({sequences, dispatch}: Everything) {
    let inx = sequences.current;
    let sequence: Sequence = sequences.all[inx] || nullSequence();
    let fixThisToo = function(key: string) {
        let xfer = dispatch(stepGet(key)) as DataXferObj;
        if (xfer.draggerId === NULL_DRAGGER_ID) {
            dispatch(pushStep(xfer.value));
        } else {
            let from = xfer.draggerId;
            // Remove it from where it was.
            dispatch(removeStep(from));
            // Push it to the end.
            dispatch(pushStep(xfer.value));
        };
    };
    return (<div>
        <div className="widget-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <button className="green button-like widget-control"
                        onClick={save(dispatch, sequence)}>
                        {t("Save")} {sequence.dirty ? " *" : ""}
                    </button>
                    <button className="green button-like widget-control"
                        onClick={performSeq(dispatch, sequence)}>
                        {t("Save & Run")}
                    </button>
                    <button className="red button-like widget-control"
                        onClick={destroy(dispatch, sequence, inx)}>
                        {t("Delete")}
                    </button>
                    <button className="yellow button-like widget-control"
                        onClick={copy(dispatch, sequence)}>
                        {t("Copy")}
                    </button>
                    <div className="widget-header">
                        <h5>{t("Sequence Editor")}</h5>
                        <i className="fa fa-question-circle widget-help-icon">
                            <div className="widget-help-text">
                                {t(`Drag and drop commands here to create
                              sequences for watering, planting seeds,
                              measuring soil properties, and more. Press the
                              Test button to immediately try your sequence
                              with FarmBot. You can also edit, copy, and delete
                              existing sequences; assign a color; and give
                              your commands custom names.`)}
                            </div>
                        </i>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="widget-content no-bottom-padding">
                        <div className="row">
                            <div className="col-sm-11">
                                <BlurableInput value={sequence.name}
                                    onCommit={handleNameUpdate(dispatch)} />
                            </div>
                            <ColorPicker current={sequence.color}
                                onChange={(color) => {
                                    dispatch(editCurrentSequence(
                                        { color }
                                    ));
                                } } />
                        </div>
                        {<StepList sequence={sequence}
                            dispatch={dispatch}
                            sequences={sequences.all} />}
                        <div className="row">
                            <div className="col-sm-12">
                                <DropArea isLocked={true}
                                    callback={fixThisToo}>
                                    {t("DRAG STEP HERE")}
                                </DropArea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
