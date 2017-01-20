import * as React from "react";
import { Link } from "react-router";
import { Everything } from "../../interfaces";
import { ScheduledEvent } from "../interfaces";
import { Select } from "../../ui";

interface ScheduledEventProps {
  scheduledEvent: ScheduledEvent;
}

export class ScheduleEvent extends React.Component<ScheduledEventProps, {}> {

  hasPassed(date: Date) { return date < new Date(); }

  formatTime(date: Date) {
    let hours = date.getHours();
    return `${hours} ${(hours > 12) ? "a" : "p"}`;
  }

  render() {
    let evnt = this.props.scheduledEvent;
    let isPassed = this.hasPassed(evnt.time) ? "past" : "";

    return <div className={`event ${isPassed}`}>
      <div className="event-time">
        {this.formatTime(evnt.time)}
      </div>
      <div className="event-title">{evnt.desc}</div>
    </div>;
  }
}

export class FarmEvents extends React.Component<Everything, {}> {
  render() {
    return <div className="panel-container magenta-panel">
      <div className="panel-header magenta-panel">
        <div className="panel-tabs">
          <ul>
            <li>
              <Link to="/app/designer/plants"
                activeClassName={"active"}>
                Plants
              </Link>
            </li>
            <li>
              <Link to="/app/designer/farm_events"
                activeClassName={"active"}>
                Farm Events
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="panel-content events">

        <div className="row">
          <i className="col-sm-2 col-md-2 fa fa-calendar"></i>
          <Select className="col-sm-10 col-md-10"
            options={[{ label: "January 1", value: 1 }]} />
        </div>

        <div className="event-list">

          {/* Foreach these guys.. */}
          <div className="event-date col-sm-2">
            <label className="month-abbr">AUG</label>
            <label className="month-day">21</label>
          </div>

          <div className="event-block-list">
            {/* aaand these ones */}
            <div className="event-block col-sm-10">
              <span className="time">4am</span>
              <i className="fa fa-tint"></i>
              <span className="desc">Water</span>
            </div>
            <div className="event-block col-sm-10">
              <span className="time">3pm</span>
              <i className="fa fa-leaf"></i>
              <span className="desc">Seed</span>
            </div>
          </div>

        </div>

        <Link to="/app/designer/farm_events/add">
          <div className="plus-button add-event button-like"
            data-toggle="tooltip" title="Add event">
            <i className="fa fa-2x fa-plus" />
          </div>
        </Link>

      </div>
    </div>;
  }
}
