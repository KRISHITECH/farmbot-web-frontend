import * as React from "react";
import { parseClassNames } from "./util";

interface ColumnProps {
    children?: JSX.Element | undefined;
    /** {[col-size, offset]} or just {col-size} */
    xs?: number[] | number;
    /** {[col-size, offset]} or just {col-size} */
    sm?: number[] | number;
    /** {[col-size, offset]} or just {col-size} */
    md?: number[] | number;
    /** {[col-size, offset]} or just {col-size} */
    lg?: number[] | number;
}

export function Col(props: ColumnProps) {
    let classNames = parseClassNames(props, "");
    return <div className={classNames}>
        {props.children}
    </div>;
}
