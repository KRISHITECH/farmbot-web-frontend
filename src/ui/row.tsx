import * as React from "react";

interface RowProps {
    children?: JSX.Element | undefined;
}

export function Row(props: RowProps) {
    return <div className="row">
        {props.children}
    </div>;
}
