import { CeleryNode as Step, LATEST_VERSION, MoveAbsolute } from "./corpus";
import {
    Sequence,
    SequenceReducerState,
    ChanParams,
    MessageParams,
    UpdateAbsoluteStepPayl,
    SequenceBodyMember
} from "./interfaces";
import {
    nullSequence,
    EditCurrentSequence,
    SpliceStepPayl,
    MoveStepPayl
} from "./actions";
import { generateReducer } from "../redux/generate_reducer";
import { move } from "../util";
import * as _ from "lodash";
import { Sync } from "../interfaces";

/** Adds an empty sequence to the front of the list. */
function populate(state: SequenceReducerState): Sequence {
    // This worries me. What if #current and #all get out of sync?
    let current_sequence = nullSequence();
    state.all.unshift(current_sequence);
    state.current = 0;
    return current_sequence;
}

const initialState: SequenceReducerState = {
    all: [
        {
            color: "red",
            kind: "sequence",
            args: { version: LATEST_VERSION },
            name: "New Sequence",
            body: [],
            dirty: false
        }
    ],
    current: 0
};

export let sequenceReducer = generateReducer<SequenceReducerState>(initialState)
    .add<UpdateAbsoluteStepPayl>("UPDATE_MOVE_ABSOLUTE_STEP", function (s, a) {
        let { data, index } = a.payload;
        let seq = s.all[s.current];
        seq.dirty = true;
        let step = (seq.body || [])[index] as MoveAbsolute;

        delete step.args.location;
        if (data.value === "---") {
            let { x, y, z } = data;
            step.args.location = { args: { x, y, z }, kind: "coordinate" };
        } else {
            let { value } = data;
            value = parseInt(value.toString(), 10);
            step.args.location = { args: { tool_id: value }, kind: "tool" };
        }
        return s;
    })
    .add<ChanParams>("ADD_CHANNEL", function (s, a) {
        let { index, channel_name} = a.payload;
        let seq = s.all[s.current];
        seq.dirty = true;
        let step = (seq.body || [])[index];
        if (step.kind === "send_message") {
            step.body = step.body || [];
            step.body.push({ kind: "channel", args: { channel_name } });
            step.body = _.uniq(step.body, (t) => t.args.channel_name);
        } else {
            throw new Error("ADD_CHANNEL only works on `send_message` nodes.");
        }
        return s;
    })
    .add<ChanParams>("REMOVE_CHANNEL", function (s, a) {
        let { index, channel_name} = a.payload;
        let seq = s.all[s.current];
        seq.dirty = true;
        let step = (seq.body || [])[index];
        if (step.kind === "send_message") {
            step.body = step.body || [];
            step.body.push({ kind: "channel", args: { channel_name } });
            step.body = _.select(step.body, function (t) {
                return t.args.channel_name !== channel_name;
            });
        } else {
            throw new Error("ADD_CHANNEL only works on `send_message` nodes.");
        }
        return s;
    })
    .add<MessageParams>("UPDATE_MESSAGE_TYPE", function (s, a) {
        let { value, index} = a.payload;
        let seq = s.all[s.current];
        seq.dirty = true;
        let step = (seq.body || [])[index];
        if (step.kind === "send_message") {
            step.args.message_type = value.toString();
        }
        return s;
    })
    .add<{ index: number, comment: string }>("ADD_COMMENT", function (s, a) {
        let seq = s.all[s.current];
        let node = (seq.body || [])[a.payload.index];
        markDirty(s);
        node.comment = a.payload.comment;
        // API complains about empty values.
        // TODO: Clean up BE.
        if (!node.comment) { delete node.comment; }
        return s;
    })
    .add<{ step: Step }>("PUSH_STEP", function (state, action) {
        let current_sequence = state
            .all[state.current] || populate(state);
        markDirty(state);
        let { step } = action.payload;
        let stepp = step as SequenceBodyMember;
        (current_sequence.body || []).push(stepp);
        return state;
    })
    .add<void>("ADD_SEQUENCE", function (state, action) {
        populate(state);
        return state;
    })
    .add<EditCurrentSequence>("EDIT_CURRENT_SEQUENCE",
    function (state, action) {
        let currentSequence = state.all[state.current] || populate(state);
        currentSequence.name = action.payload.name || currentSequence.name;
        currentSequence.color = action.payload.color || currentSequence.color;
        markDirty(state);
        return state;
    })
    .add<{ step: Step, index: number }>("CHANGE_STEP",
    function (state, action) {
        let currentSequence = state.all[state.current];
        let currentStep = (currentSequence.body || [])[action.payload.index];
        markDirty(state);
        _.assign(currentStep, action.payload.step);
        return state;
    })
    .add<{ value: string | number, index: number, field: string }>(
    "CHANGE_STEP_SELECT", function (state, action) {
        // CHRIS: I MADE SOME (stub) CHANGES HERE. Let's talk about this one.
        //        proceed with caution, there may be issues with my changes.
        //        - Rick wuz here. 12/29/16
        markDirty(state);
        let currentSequence = state.all[state.current];
        let currentStep = (currentSequence.body || [])[action.payload.index];
        if (currentStep.kind === "_if") {
            let sub_sequence_id = parseInt(action.payload.value.toString(), 10);
            currentStep.args._then = {
                kind: "execute",
                args: { sub_sequence_id }
            };
            // TODO Come back and add `_else` feature.
            currentStep.args._else = { kind: "nothing", args: {} };
            return state;
        } else {
            console.warn(`Unexpectedly got a '${currentStep.kind}' step.`);
            return state;
        }
    })
    .add<{ index: number }>("REMOVE_STEP", function (state, action) {
        let seq = state.all[state.current];
        let index = action.payload.index;
        seq.body = _.without((seq.body || []), (seq.body || [])[index]);
        markDirty(state);
        return state;
    })
    .add<Sequence>("SAVE_SEQUENCE_OK", function (state, action) {
        state.all[state.current] = action.payload;
        return state;
    })
    .add<Sync>("FETCH_SYNC_OK", function (state, action) {
        state.all = action.payload.sequences || [];
        return state;
    })
    .add<number>("SELECT_SEQUENCE", function (state, action) {
        let inx = action.payload;
        if (state.all[inx]) { state.current = inx; }
        return state;
    })
    .add<Sequence>("DELETE_SEQUENCE_OK", function (state, action) {
        let found = _.find(state.all, { name: action.payload.name });
        if (found) {
            _.pull(state.all, found);
            state.current = 0;
        } else {
            throw new Error("Tried to delete a sequence that doesn't exist. ");
        }
        return state;
    })
    .add<Sequence>("COPY_SEQUENCE", function (state, action) {
        let seq = action.payload;
        // Unset the ID to avoid accidentally overwriting parent.
        seq.id = undefined;
        seq.dirty = true;
        // "My sequence (copy 1)" => "My sequence"
        let baseName = seq.name.replace(/ \(copy \d*\)/, "");
        // TODO: This function has string typing, regexes and inband signalling.
        // I like to avoid all of those. Possible refactor target?
        let copies = _.select(state.all, function (item) {
            return (item.name.indexOf(baseName) !== -1);
        }).length;
        // Give it a name with the (copy X) stripped out
        seq.name = baseName;
        // Add the (copy X) back
        seq.name += ` (copy ${copies})`;
        state.current = state.all.length;
        state.all.push(seq);
        return state;
    })
    .add<MoveStepPayl>("MOVE_STEP", function (s, a) {
        let { from, to } = a.payload;
        markDirty(s);
        s.all[s.current].body = move<Step>((s.all[s.current].body || []),
            a.payload.from,
            a.payload.to) as SequenceBodyMember[];
        if (from < to) {
            // EDGE CASE: If you drag a step upwards, it will end up in the
            // wrong slot. As a fix, I swap the "to" index with the item below
            // it an vice versa.
            // I KNOW THERE ARE SHORTER WAYS TO SWAP AN ARRAY.
            // DO NOT OPTOMIZE. INTENTIONALLY LENGTHENED FOR CLARITY.
            let list = (s.all[s.current].body || []);
            let topIndex = to;
            let bottomIndex = to - 1;
            let top = list[topIndex];
            let bottom = list[bottomIndex];
            list[topIndex] = bottom;
            list[bottomIndex] = top;
        }
        return s;
    })
    .add<SpliceStepPayl>("SPLICE_STEP", function (s, a) {
        markDirty(s);
        let body = s.all[s.current].body || [];
        let step = a.payload.step as SequenceBodyMember;
        body.splice(a.payload.insertBefore, 0, step);
        return s;
    });

function markDirty(s: SequenceReducerState) {
    s.all[s.current].dirty = true;
};
