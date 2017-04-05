import * as React from "react";
import { Link } from "react-router";
import { DropDownProps, NavBarState, NavBarProps } from "./interfaces";
import { EStopButton } from "../devices/components/e_stop_btn";
import { t } from "i18next";
import { Session } from "../session";
import { Markdown } from "../ui";
import * as moment from "moment";
import { SyncButton } from "./sync_button";
import { history } from "../history";

let DropDown = ({ auth, onClick }: DropDownProps) => {
  if (!auth) { return <span></span>; }
  let hasName = auth.user && auth.user.name;
  let greeting = hasName ? `${hasName} ▾` : "";

  return <div className="nav-dropdown">
    <span>{greeting}</span>
    <div className="nav-dropdown-content">
      <ul>
        <li>
          <Link to="/app/account">
            <i className="fa fa-cog"></i>
            {t("Account Settings")}
          </Link>
        </li>
        <li>
          <a onClick={onClick}>
            <i className="fa fa-sign-out"></i>
            {t("Logout")}
          </a>
        </li>
      </ul>
      <div className="version-links">
        <span>{t("Frontend")}:
            <a href="https://github.com/FarmBot/farmbot-web-frontend"
            target="_blank">{process.env.SHORT_REVISION}
          </a>
        </span>
      </div>
    </div>
  </div>;
};

let links = [
  { name: "Farm Designer", icon: "leaf", url: "/app/designer" },
  { name: "Controls", icon: "keyboard-o", url: "/app/controls" },
  { name: "Device", icon: "cog", url: "/app/device" },
  { name: "Sequences", icon: "server", url: "/app/sequences" },
  { name: "Regimens", icon: "calendar-check-o", url: "/app/regimens" },
  { name: "Tools", icon: "wrench", url: "/app/tools" }
];

export class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor() {
    super();
    this.state = { mobileNavExpanded: false, tickerExpanded: false };
  }

  toggleMobileNav = () => {
    let { mobileNavExpanded } = this.state;
    /** Don't let user scroll when nav is open */
    // document.body.classList.toggle("freeze");
    this.setState({ mobileNavExpanded: !mobileNavExpanded });
  }

  toggleTicker = () => {
    this.forceUpdate
    let { tickerExpanded } = this.state;
    this.setState({ tickerExpanded: !tickerExpanded });
  }

  logout = () => Session.clear(true);

  render() {
    let mobileMenuClass = this.state.mobileNavExpanded ? "expanded" : "";
    let tickerClass = this.state.tickerExpanded ? "expanded" : "";
    // The way our app is laid out, we'll pretty much always want this bit.
    let pageName = history.getCurrentLocation().pathname.split("/")[2] || "";
    let { toggleMobileNav, toggleTicker, logout } = this;

    return <div className="nav-wrapper">
      <nav role="navigation">
        <button
          className="mobile-and-tablet-only"
          onClick={toggleMobileNav}>
          <i className="fa fa-bars"></i>
        </button>
        <span className="page-name">{pageName}</span>
        <div className={`links ${mobileMenuClass}`}>
          <ul>
            {links.map(link => {
              return <li key={link.url}>
                <Link to={link.url}
                  activeClassName="active">
                  <i className={`fa fa-${link.icon}`} />
                  {link.name}
                </Link>
              </li>;
            })}
          </ul>
          {/** TODO: Getting the links from the desktop dropdown to the
          mobile slide-out menu involves gnarly (and probably mobile-
          incompatible) CSS. I'll look into this one. -CV */}
          <ul className="mobile-menu-extras">
            <li>
              <Link to="/app/account">
                <i className="fa fa-cog"></i>{t("Account Settings")}
              </Link>
            </li>
            <li>
              <a onClick={logout}>
                <i className="fa fa-sign-out"></i>
                {t("Logout")}
              </a>
            </li>
          </ul>
          <div className="version-links mobile-only">
            {t("Frontend")}:
                <a href="https://github.com/FarmBot/farmbot-web-frontend"
              target="_blank">
              {process.env.SHORT_REVISION}
            </a>
          </div>
        </div>

        <div className={`ticker-list ${tickerClass}`} onClick={toggleTicker}>
          {this.props.logs.map(log => {
            let time = moment.utc(log.created_at).local().format("h:mm a");
            return <div key={log.id} className="status-ticker-wrapper">
              <div className={`saucer ${log.meta.type}`} />
              <label className="status-ticker-message">
                <Markdown>
                  {log.message.toString() || "Loading"}
                </Markdown>
              </label>
              <label className="status-ticker-created-at">
                {time}
              </label>
            </div>;
          })}
        </div>

        <div className="right-nav-content">
          <SyncButton
            bot={this.props.bot}
            auth={this.props.auth}
            dispatch={this.props.dispatch} />
          <EStopButton
            bot={this.props.bot}
            auth={this.props.auth} />
          <DropDown
            onClick={logout}
            auth={this.props.auth} />
        </div>

        <div className={`underlay ${mobileMenuClass}`}
          onClick={toggleMobileNav}></div>
      </nav>
    </div>;
  }
}
