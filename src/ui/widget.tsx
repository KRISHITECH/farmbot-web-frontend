import * as React from "react";
import { parseClassNames } from "./util";

interface WidgetProps {
    children?: JSX.Element | undefined;
}

export function Widget(props: WidgetProps) {
    // let classNames = parseClassNames(props, "widget");
    return <div className="widget">
        {props.children}
    </div>;
}
