import * as React from "react";
import { Everything } from "../interfaces";
import * as _ from "lodash";

interface MobileSequencesNavProps extends Everything {
  params: {
    sequence: string;
  };
}

export function MobileSequencesNav(props: MobileSequencesNavProps) {
  return <div className="mobile-only sequences-mobile-nav col-md-3 col-sm-12">
    <div className="widget-wrapper">
      <div className="widget-header">
        <a href="javascript:history.back()" className="back-arrow">
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;
          {_.capitalize(props.params.sequence.toString()) || "Name not found"}
        </a>
      </div>
    </div>
  </div>;
}
