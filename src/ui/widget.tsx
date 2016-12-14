import * as React from "react";

interface WidgetProps {
    children?: JSX.Element | undefined;
}

export function Widget(props: WidgetProps) {
    return <div className="widget">
        {props.children}
    </div>;
}
