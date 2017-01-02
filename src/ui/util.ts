interface ParseClassNamesProps {
    xs?: number[] | number;
    sm?: number[] | number;
    md?: number[] | number;
    lg?: number[] | number;
}

export function parseClassNames(props: ParseClassNamesProps, base: string) {
    // Base class
    let classNames = base;

    // First index of the array is the col size
    // If it's not an array, it's just the number value
    if (props.xs instanceof Array) {
        classNames += ` col-xs-${props.xs[0]}`;
    } else if (props.xs) {
        classNames += ` col-xs-${props.xs}`;
    }
    if (props.sm instanceof Array) {
        classNames += ` col-sm-${props.sm[0]}`;
    } else if (props.sm) {
        classNames += ` col-sm-${props.sm}`;
    }
    if (props.md instanceof Array) {
        classNames += ` col-md-${props.md[0]}`;
    } else if (props.md) {
        classNames += ` col-md-${props.md}`;
    }
    if (props.lg instanceof Array) {
        classNames += ` col-lg-${props.lg[0]}`;
    } else if (props.lg) {
        classNames += ` col-lg-${props.lg}`;
    }

    // Second index is the col offset
    if (props.xs instanceof Array) {
        classNames += ` col-xs-offset-${props.xs[1]}`;
    }
    if (props.sm instanceof Array) {
        classNames += ` col-sm-offset-${props.sm[1]}`;
    }
    if (props.md instanceof Array) {
        classNames += ` col-md-offset-${props.md[1]}`;
    }
    if (props.lg instanceof Array) {
        classNames += ` col-lg-offset-${props.lg[1]}`;
    }

    return classNames;
}
