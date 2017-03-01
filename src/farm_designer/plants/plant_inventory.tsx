import * as React from "react";
import { Link } from "react-router";
import { Everything } from "../../interfaces";
import { Plant } from "../interfaces";
import { FBSelect, DropDownItem } from "../../ui";
import { connect } from "react-redux";
import * as moment from "moment";
import { t } from "i18next";

function OptionComponent(plants: Plant[]) {
  let indexedById = _.indexBy(plants, "id");
  return (props: DropDownItem) => {
    let {
      img_url,
      planted_at,
    } = indexedById[props.value as number]; // TODO: Remove typecast after refactor.

    let dayPlanted = moment();

    // Same day = 1 !0
    let daysOld = dayPlanted.diff(moment(planted_at), "days") + 1;
    return <div className="plant-search-item">
      <img className="plant-search-item-image" src={img_url} />
      <span className="plant-search-item-name">{props.label}</span>
      <i className="plant-search-item-age">
        {daysOld} days old</i>
    </div>;
  };
}

@connect((state: Everything) => state)
export class Plants extends React.Component<Everything, {}> {

  handleRedirect(e: DropDownItem) {
    this.props.router.push(`/app/designer/plants/` + e.value);
  }

  render() {
    let { plants } = this.props.sync;

    let plantOptions = plants.map(plant => {
      if (plant.id) {
        return { label: plant.name, value: plant.id };
      } else {
        throw new Error("Thought plants would have an ID here.");
      }
    });

    return <div className="panel-container green-panel plant-inventory-panel">
      <div className="panel-header green-panel">
        <div className="panel-tabs">
          <Link to="/app/designer" className="mobile-only">
            {t("Designer")}
          </Link>
          <Link to="/app/designer/plants" className="active">
            {t("Plants")}
          </Link>
          <Link to="/app/designer/farm_events" >
            {t("Farm Events")}
          </Link>
        </div>
      </div>

      <div className="panel-content row">

        <div className="thin-search-wrapper">
          <i className="fa fa-search"></i>
          <FBSelect list={plantOptions}
            optionComponent={OptionComponent(this.props.sync.plants)}
            onChange={this.handleRedirect.bind(this)}
            isOpen={true}
            placeholder="Search Plants"
          />
        </div>

      </div>

      <Link to="/app/designer/plants/crop_search">
        <div className="plus-button add-plant button-like"
          data-toggle="tooltip"
          title="Add plant">
          <i className="fa fa-2x fa-plus" />
        </div>
      </Link>

    </div>;
  }
};
