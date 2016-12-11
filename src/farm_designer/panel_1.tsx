import * as React from "react";
// Import all of the Plant (green) panel views
import { Plants } from "./plant_inventory";
import { NoTab } from "./no_tab";
import { SpeciesCatalog } from "./species_catalog";
import { SpeciesInfo } from "./species_info";
import { PlantInfo } from "./plant_info";
// Import all of the Group (blue) panel views
import { Groups } from "./group_inventory";
import { AddGroup } from "./add_group";
// Import all of the Zone (brown) panel views
import { Zones } from "./zone_inventory";
import { AddZone } from "./add_zone";
// Import the right panel (for display on mobile)
import { Panel2 } from "./panel_2";
import { getParam } from "../util";


// Dynamically determine what to render in the designer"s first panel
// based on the value of hash fragment "p1"
type ComponentMap = { [name: string]: React.ComponentClass<any> };
export class Panel1 extends React.Component<any, any> {
  get tabName(): string {
    return (getParam("p1") || "Plants");
  }

  get content() {
    let component =
      ({
        Plants,
        NoTab,
        SpeciesCatalog,
        SpeciesInfo,
        PlantInfo,
        Groups,
        AddGroup,
        Zones,
        AddZone,
        Panel2
      } as ComponentMap)[this.tabName];
    return React.createElement(component, this.props);
  }

  render() {
    return (
      <div>
        {this.content}
      </div>
    );
  }
};
