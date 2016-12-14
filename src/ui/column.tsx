import * as React from "react";

interface ColumnProps {
    children?: JSX.Element | undefined;
    sm?: string;
    md?: string;
    lg?: string;
}

export function Col(props: ColumnProps) {
    let finalClassName = "fb-col";
    if (props.sm) { finalClassName += ` sm-${props.sm}`; }
    if (props.md) { finalClassName += ` md-${props.md}`; }
    if (props.lg) { finalClassName += ` lg-${props.lg}`; }
    return <div className={finalClassName}>
        {props.children}
    </div>;
}
