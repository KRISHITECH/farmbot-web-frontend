import * as React from "react";
import { Link } from "react-router";
import { sync } from "../devices/actions";
import { Everything } from "../interfaces";
import {
    NavButtonProps,
    DropDownProps,
    NavBarState
} from "./interfaces";
import { EStopButton } from "../devices/components/e_stop_btn";
import { connect } from "react-redux";
import { t } from "i18next";
import { Session } from "../session";
import { Markdown } from "../ui";
import * as moment from "moment";

let DropDown = ({ auth, onClick, sync }: DropDownProps) => {
    if (!auth) { return <span></span>; }
    let hasName = auth.user && auth.user.name;
    let greeting = hasName ? `${hasName} ▾` : "";
    return (
        <div className="nav-dropdown">
            <span>{greeting}</span>
            <div className="nav-dropdown-content">
                <ul>
                    <li>
                        <Link to="/app/account">
                            <i className="fa fa-cog"></i>{t("Account Settings")}
                        </Link>
                    </li>
                    <li>
                        <a onClick={onClick}>
                            <i className="fa fa-sign-out"></i>{t("Logout")}
                        </a>
                    </li>
                </ul>
                <div className="version-links">
                    <span>API:
                    <a href="https://github.com/FarmBot/Farmbot-Web-API"
                            target="_blank">{sync.api_version}
                        </a>
                    </span>
                    <span>Frontend:
                    <a href="https://github.com/FarmBot/farmbot-web-frontend"
                            target="_blank">{process.env.SHORT_REVISION}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

let SyncButton = ({auth, bot, dispatch}: NavButtonProps) => {
    if (!auth) { return <span></span>; }
    let dirty = bot.dirty;
    let color = dirty ? "yellow" : "green";
    return <button className={`nav-sync button-like ${color}`}
        onClick={() => { dispatch(sync()); } }>
        {dirty ? t("Sync Required") : t("Synced")}
    </button>;
};

let links = [
    { name: "Farm Designer", icon: "leaf", url: "/app/designer" },
    { name: "Controls", icon: "keyboard-o", url: "/app/controls" },
    { name: "Devices", icon: "cog", url: "/app/devices" },
    { name: "Sequences", icon: "server", url: "/app/sequences" },
    {
        name: "Regimens", icon: "calendar-check-o",
        url: "/app/regimens"
    },
    { name: "Tools", icon: "wrench", url: "/app/tools" }
];

@connect((state: Everything) => state)
export class NavBar extends React.Component<Everything, NavBarState> {
    constructor() {
        super();
        this.state = {
            mobileNavExpanded: false,
            tickerExpanded: false
        };
        this.hoverToggleTicker = this.hoverToggleTicker.bind(this);
        this.clickToggleTicker = this.clickToggleTicker.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
        this.logout = this.logout.bind(this);
    }

    toggleNav() {
        /** Don't let user scroll when nav is open */
        document.body.classList.toggle("freeze");
        this.setState({
            mobileNavExpanded: !this.state.mobileNavExpanded
        });
    }

    logout() {
        Session.clear();
        location.reload(true);
    }

    hoverToggleTicker() {
        /** Hack to prevent ui bugs */
        var width = Math.max(document.documentElement.clientWidth,
            window.innerWidth || 0);
        if (width <= 830) { return; }
        /** Don't let user scroll when nav is open */
        document.body.classList.toggle("freeze");
        this.setState({
            tickerExpanded: !this.state.tickerExpanded
        });
    }

    clickToggleTicker() {
        /** Hack to prevent ui bugs */
        var width = Math.max(document.documentElement.clientWidth,
            window.innerWidth || 0);
        if (width >= 830) { return; }
        /** Don't let user scroll when nav is open */
        document.body.classList.toggle("freeze");
        this.setState({
            tickerExpanded: !this.state.tickerExpanded
        });
    }

    render() {
        let mobileMenuClass = this.state.mobileNavExpanded ? "expanded" : "";
        let pageName = this.props.location.pathname.split("/").pop() || "";
        let { toggleNav, logout, hoverToggleTicker, clickToggleTicker } = this;
        let isActive = this.state.tickerExpanded ? "active" : "";

        return <nav role="navigation">
            <button
                onClick={() => { toggleNav(); } }>
                <i className="fa fa-bars"></i>
            </button>
            <span className="page-name">{pageName}</span>
            <div className={`links ${mobileMenuClass}`}>
                <ul>
                    {links.map(link => {
                        return (
                            <li key={link.url}>
                                <Link to={link.url}
                                    /** TODO: Royal pain. This onClick fires
                                     * every time a link is clicked in the 
                                     * desktop nav. Which in turn "freezes"
                                     * the user scroll when not desired. 
                                     * Tried all sorts of plugins and 
                                     * alternatives. No dice.
                                     */
                                    // onClick={() => { toggleNav(); } } 
                                    activeClassName="active">
                                    <i className={`fa fa-${link.icon}`} />
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {/** TODO: Getting the links from the desktop dropdown to the 
                    mobile slide-out menu involves gnarly (and probably mobile-
                    incompatible) CSS. I'll look into this one. -CV */}
                <ul className="mobile-menu-extras">
                    <li>
                        <Link to="/app/account"
                            onClick={() => { toggleNav(); } }>
                            <i className="fa fa-cog"></i>{t("Account Settings")}
                        </Link>
                    </li>
                    <li>
                        <a onClick={logout}>
                            <i className="fa fa-sign-out"></i>{t("Logout")}
                        </a>
                    </li>
                </ul>
                <div className="version-links mobile-only">
                    <span>API:
                    <a href="https://github.com/FarmBot/Farmbot-Web-API"
                            target="_blank">{this.props.sync.api_version}
                        </a>
                    </span>
                    <span>Frontend:
                    <a href="https://github.com/FarmBot/farmbot-web-frontend"
                            target="_blank">{process.env.SHORT_REVISION}
                        </a>
                    </span>
                </div>
            </div>
            <SyncButton { ...this.props } />
            <EStopButton { ...this.props } />

            <div className={`ticker-list ${isActive}`}
                onClick={() => { clickToggleTicker(); } }
                onMouseEnter={() => { hoverToggleTicker(); } }
                onMouseLeave={() => { hoverToggleTicker(); } }>
                {this.props.sync.logs.map((log, index) => {
                    let time = moment.utc(log.created_at).format("HH:mma");
                    /** Otherwise yields "03:15PM"" etc. */
                    if (time.charAt(0) === "0") { time = time.substr(1); }
                    return <div key={index} className="status-ticker-wrapper">
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

            <DropDown onClick={logout} { ...this.props } />
            <div className={`underlay ${mobileMenuClass}`}
                onClick={() => { toggleNav(); } }></div>
        </nav>;
    }
}
