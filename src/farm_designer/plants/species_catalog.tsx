import * as React from "react";
import { BackArrow } from "../../ui";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import { t } from "i18next";
import { OpenFarmSearch } from "./openfarm_search";
import { DesignerState, CropLiveSearchResult } from "../interfaces";

interface SpeciesCatalogProps {
  cropSearchQuery: string;
  dispatch: Function;
  designer: DesignerState;
  cropSearchResults: CropLiveSearchResult[];
}

function mapStateToProps(props: Everything): SpeciesCatalogProps {
  return {
    cropSearchQuery: props.resources.consumers.farm_designer.cropSearchQuery,
    dispatch: props.dispatch,
    designer: props.resources.consumers.farm_designer,
    cropSearchResults: props
      .resources
      .consumers
      .farm_designer
      .cropSearchResults || []
  }
}

@connect(mapStateToProps)
export class SpeciesCatalog extends React.Component<SpeciesCatalogProps, {}> {
  doSearch = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatch({
      type: "SEARCH_QUERY_CHANGE",
      payload: e.currentTarget.value
    });
  }

  render() {
    return <div className="panel-container green-panel species-catalog-panel">
      <div className="panel-header green-panel">
        <p className="panel-title">
          <BackArrow /> {t("Choose a species")}
        </p>
      </div>
      <div className="panel-content">
        <div className="thin-search-wrapper">
          <i className="fa fa-search"></i>

          <div className="thin-search">
            <input value={this.props.cropSearchQuery}
              onChange={(e) => { this.doSearch(e); }}
              className="search"
              placeholder="Search OpenFarm" />
          </div>
        </div>
        <div className="panel-content">
          <div className="crop-search-result-wrapper row">
            <OpenFarmSearch
              dispatch={this.props.dispatch}
              query={this.props.cropSearchQuery}
              cropSearchResults={this.props.cropSearchResults} />
          </div>
        </div>
      </div>
    </div>;
  }
}
