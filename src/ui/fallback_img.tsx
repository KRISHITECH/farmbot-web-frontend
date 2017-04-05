import * as React from "react";

interface Props extends React.HTMLProps<HTMLImageElement> {
  src: string;
  fallback: string;
}

type State = Partial<{ needsFallback: boolean }>;
/** Like a normal `<img>`, but it has a `fallback` URL if the image does not
 * load*/
export class FallbackImg extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { needsFallback: false };
  }

  componentWillReceiveProps(next: Props) {
    // Sorry. The webcam page needs live updates. <img/> tag was acting wonky.
    (next.src !== this.props.src) && this.setState({ needsFallback: false });
  }

  fallback = () => <img {...this.props} src={this.props.fallback} />;

  dontFallback = () => {
    return <img {...this.props}
      onError={() => this.setState({ needsFallback: true })}
      src={this.props.src} />;
  }

  render() {
    return ((this.state.needsFallback) ? this.fallback : this.dontFallback)();
  }
}
