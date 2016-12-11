import * as React from "react";

interface SelectProps {
    children?: JSX.Element | undefined;
    onChange?: (e: React.SyntheticEvent<HTMLSelectElement>) => void;
    value?: string;
    id?: string;
}

export function Select(props: SelectProps) {
    return <div className="select-wrapper">
        <select
            id={props.id}
            onChange={props.onChange}
            value={props.value}>
            {props.children}
        </select>
    </div>;
}
