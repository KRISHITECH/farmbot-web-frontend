import * as React from "react";
import { NavBar } from "./nav";
import { Everything, Log } from "./interfaces";
import { init, error } from "./ui";
import { connect } from "react-redux";
import { Spinner } from "./spinner";
import { AuthState } from "./auth/interfaces";
import { BotState } from "./devices/interfaces";
import * as _ from "lodash";
import { ResourceName } from "./resources/tagged_resources";
import { selectAllLogs } from "./resources/selectors";

/** Remove 300ms delay on touch devices - https://github.com/ftlabs/fastclick */
let fastClick = require("fastclick");
fastClick.attach(document.body);

/** For the logger module */
init();

/** If the sync object takes more than 10s to load, the user will be granted
 * access into the app, but still warned. */
const TIMEOUT_MESSAGE = `App could not be fully loaded, 
we recommend you try refreshing the page.`;

interface AppProps {
  dispatch: Function;
  loaded: ResourceName[];
  logs: Log[];
  auth: AuthState | undefined;
  bot: BotState;
}

function mapStateToProps(props: Everything): AppProps {
  let dispatch = props.dispatch;

  return {
    dispatch,
    auth: props.auth,
    bot: props.bot,
    logs: selectAllLogs(props.resources.index).map(x => x.body).reverse(),
    loaded: props.resources.loaded
  };
}
/** Relational resources that *must* load before app starts.
 * App will crash at load time if they are not pre-loaded.
*/
const MUST_LOAD: ResourceName[] = [ "sequences", "regimens", "farm_events" ];

@connect(mapStateToProps)
export default class App extends React.Component<AppProps, {}> {
  get isLoaded() {
    return (MUST_LOAD.length ===
      _.intersection(this.props.loaded, MUST_LOAD).length);
  }
  componentDidMount() {
    setTimeout(() => {
      if (!this.isLoaded) {
        this.props.dispatch({ type: "SYNC_TIMEOUT_EXCEEDED" });
        error(TIMEOUT_MESSAGE, "Warning");
      }
    }, 10000);
  }

  render() {
    let syncLoaded = this.isLoaded;
    return <div className="app">
      <NavBar
        auth={this.props.auth}
        bot={this.props.bot}
        dispatch={this.props.dispatch}
        logs={this.props.logs} />
      {!syncLoaded && <Spinner radius={33} strokeWidth={6} />}
      {syncLoaded && this.props.children}
    </div>;
  }
}
