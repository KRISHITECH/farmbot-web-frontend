import * as React from "react";

interface PageProps {
    children?: JSX.Element | undefined;
    className?: string;
}

export function Page(props: PageProps) {
    let finalClassName = "page container";
    if (props.className) { finalClassName += ` ${props.className}`; }
    return <div className={finalClassName}>
        <div className="row">
            {props.children}
        </div>
    </div>;
}
