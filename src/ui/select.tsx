import * as React from "react";
import * as ReactSelect from "react-select";

interface SelectProps extends ReactSelect.ReactSelectProps {
    // children?: JSX.Element | undefined;
    // onChange?: (e: {}) => void;
    // value?: string | number;
    // id?: string;
    // options?: {}[];
    // valueComponent?: any;
    // optionComponent?: any;
    // autoFocus?: boolean;
    // placeholder?: string;
    // onInputChange?: (inputValue: string) => void;
    // className?: string;
}

export function Select(props: SelectProps) {
    return <ReactSelect
        onChange={props.onChange}
        value={props.value}
        options={props.options}
        valueComponent={props.valueComponent}
        optionComponent={props.optionComponent}
        placeholder={props.placeholder}
        onInputChange={props.onInputChange}
        className={props.className}
    />;
}
