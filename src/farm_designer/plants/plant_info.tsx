import * as React from "react";
import { BackArrow } from "../back_arrow";
import { Link } from "react-router";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import * as moment from "moment";

interface PlantInfoProps extends Everything {
    params: { plant_id: string };
}

@connect((state: Everything) => state)
export class PlantInfo extends React.Component<PlantInfoProps, {}> {
    render() {
        let plant_id = parseInt(this.props.params.plant_id);
        let plants = this.props.designer.plants;
        let currentPlant = _.findWhere(plants, { id: plant_id });

        let { name, x, y, planted_at } = currentPlant;

        let dayPlanted = moment();
        // Same day = 1 !0
        let daysOld = dayPlanted.diff(moment(planted_at), "days") + 1;
        let plantedAt = moment(planted_at).format("MMMM Do YYYY, h:mma");

        return <div className="panel-container green-panel">
            <div className="panel-header green-panel">
                <p className="panel-title">
                    <BackArrow />
                    <span className="title">{name}</span>
                    <Link to={`/app/designer/plants/${plant_id}/edit`}
                        className="right-button">
                        Edit
                    </Link>
                </p>
            </div>
            <div className="panel-content">
                <label>Plant Info</label>
                <ul>
                    <li>Started: {plantedAt}</li>
                    <li>Age: {daysOld}</li>
                    <li>Location: ({x}, {y})</li>
                </ul>
                <label>Regimens</label>
                <ul>
                    <li>Soil Acidifier</li>
                </ul>
            </div>
        </div>;
    }
}
