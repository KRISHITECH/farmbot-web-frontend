import * as React from "react";
import * as ReactSelect from "react-select";

interface SelectProps {
    children?: JSX.Element | undefined;
    onChange?: (e: React.SyntheticEvent<HTMLSelectElement>) => void;
    value?: string | number;
    id?: string;
    options?: {}[];
    // TODO: Values for anys
    valueComponent?: any;
    optionComponent?: any;
    autoFocus?: boolean;
    placeholder?: string;
}

export function Select(props: SelectProps) {
    if (props.options) {
        return <ReactSelect
            onChange={props.onChange}
            value={props.value}
            options={props.options}
            valueComponent={props.valueComponent}
            optionComponent={props.optionComponent}
            placeholder={props.placeholder} />;
    } else {
        return <div className="select-wrapper">
            <select
                id={props.id}
                onChange={props.onChange}
                value={props.value}>
                {props.children}
            </select>
        </div>;
    }
}
