import * as React from "react";
import { Sequence } from "../../sequences/interfaces";
import { setSequence } from "./actions";
import { Select } from "../../ui";
import * as _ from "lodash";

interface SequenceListProps {
    sequences: Sequence[];
    current: Sequence;
    dispatch: Function;
}

let options: {}[] = [];

export function SequenceList({sequences,
    current,
    dispatch}: SequenceListProps) {

    let selectedValue = current ? sequences.indexOf(
        _.findWhere(sequences, current)) : 0;

    sequences.map((sequence, index) => {
        let target = { label: sequence.name, value: index.toString() };
        if (!_.some(options, target)) {
            options.push({
                label: sequence.name,
                value: index.toString()
            });
        }
    });

    return <div>
        <label>Sequence</label>
        <Select value={selectedValue.toString()}
            onChange={change(dispatch, sequences)}
            options={options}
            placeholder="Select Sequence">
        </Select>
    </div>;
}

function change(dispatch: Function, sequences: Sequence[]) {
    // TODO: Solve react-select types issue. Everything breaks.
    return (event: any) => {
        let i = _.parseInt(event.value || "-999");
        dispatch(setSequence(sequences[i]));
    };
}
