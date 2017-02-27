import { FarmEvent } from "../interfaces";
import { Everything } from "../../interfaces";
import * as moment from "moment";
import { DropDownItem } from "../../ui";
import { t } from "i18next";

export interface AddFarmEventProps {
  selectOptions: DropDownItem[];
  repeatOptions: DropDownItem[];
  formatDate(input: string): string;
  save(fe: Partial<FarmEvent>): void;
}

export function mapStateToPropsAdd(state: Everything): AddFarmEventProps {

  let formatDate = (input: string) => {
    return moment(input).format("YYYY-MM-DD");
  };

  let repeatOptions = [
    { label: "Do not repeat", value: "never", name: "time_unit" },
    { label: "minutes", value: "minutely", name: "time_unit" },
    { label: "hours", value: "hourly", name: "time_unit" },
    { label: "days", value: "daily", name: "time_unit" },
    { label: "weeks", value: "weekly", name: "time_unit" },
    { label: "months", value: "monthly", name: "time_unit" },
    { label: "years", value: "yearly", name: "time_unit" }
  ];

  let selectOptions: DropDownItem[] = [];

  state.sync.regimens.map((regimen, index) => {
    selectOptions.push({ label: t("REGIMENS"), heading: true });
    let item = {
      label: regimen.name,
      executable_id: regimen.id,
      executable_type: "Regimen"
    };
    selectOptions.push(item);
  });

  state.sync.sequences.map((sequence, index) => {
    selectOptions.push({ label: t("SEQUENCES"), heading: true });
    let item = {
      label: sequence.name,
      executable_id: sequence.id,
      executable_type: "Sequence"
    };
    selectOptions.push(item);
  });

  return {
    selectOptions,
    repeatOptions,
    formatDate,
    save(fe) {
      this.props.dispatch();
    }
  };
}
