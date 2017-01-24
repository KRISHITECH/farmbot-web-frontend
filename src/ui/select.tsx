import * as React from "react";
import * as ReactSelect from "react-select";

interface DeprecatedSelectProps extends ReactSelect.ReactSelectProps {
    value?: string | number;
    id?: string;
}

/** Please do not re-use this UI component, 
 * target for eventual refactor and replacement with React-Select
 */
export function DeprecatedSelect(props: DeprecatedSelectProps) {
    return <div className="select-wrapper">
        <select
            id={props.id}
            onChange={props.onChange}
            value={props.value}>
            {props.children}
        </select>
    </div>;
}

export function Select(props: ReactSelect.ReactSelectProps) {
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
