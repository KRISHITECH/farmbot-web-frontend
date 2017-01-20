declare module 'react-canvas' {

    type Style = React.CSSProperties;

    type SurfaceProps = {
        width: number;
        height: number;
        top: number;
        left: number;
        scale?: number;
        enableCSSLayout?: boolean;
    }

    class Surface extends React.Component<SurfaceProps, {}> { }


    interface ComponentProps {
        style?: Style;

        onTouchStart?: React.TouchEventHandler<React.HTMLFactory<HTMLCanvasElement>>;
        onTouchMove?: React.TouchEventHandler<React.HTMLFactory<HTMLCanvasElement>>;
        onTouchEnd?: React.TouchEventHandler<React.HTMLFactory<HTMLCanvasElement>>;
        onTouchCancel?: React.TouchEventHandler<React.HTMLFactory<HTMLCanvasElement>>;
        onClick?: React.MouseEventHandler<React.HTMLFactory<HTMLCanvasElement>>;
    }

    class Layer extends React.Component<ComponentProps, {}> { }

    class Group extends React.Component<ComponentProps, {}> { }

    class Text extends React.Component<ComponentProps, {}> { }


    type ImageProps = {
        src: string;
        style?: Style;
        useBackingStore?: boolean;
        fadeIn?: boolean;
        fadeInDuration?: boolean;
    }

    class Image extends React.Component<ImageProps, {}> { }


    class FontFace {
        constructor(family: string, url?: string, attributes?: { style: string; weight: number });
        static Default: FontFace;

        private _fontFaceBrand: any;

        public id: string;
        public family: string;
        public url: string;
        public attributes: string;
    }

    type Measure = {
        width: number;
        height: number;
    }

    function measureText(text: string, width: number, fontFace: FontFace, fontSize: number, lineHeight: number): Measure;

    interface ListViewProps {
        style?: {};
        numberOfItemsGetter: () => number;
        itemHeightGetter: () => number;
        itemGetter: () => Layer;
        snapping?: boolean;
        scrollingDeceleration?: number;
        scrollingPenetrationAcceleration?: number;
        onScroll?: React.EventHandler<React.SyntheticEvent<React.HTMLFactory<HTMLCanvasElement>>>;
    }

    class ListView extends React.Component<ListViewProps, {}> { }
}