import { FarmEventForm } from "../interfaces";
import { Everything } from "../../interfaces";
import * as moment from "moment";
import { DropDownItem } from "../../ui";
import { t } from "i18next";
import { saveFarmEvent } from "../actions";

export interface AddEditFarmEventProps {
  selectOptions: DropDownItem[];
  repeatOptions: DropDownItem[];
  formatDate(input: string): string;
  formatTime(input: string): string;
  handleTime(e: React.SyntheticEvent<HTMLInputElement>, currentISO: string): string;
  save(fe: FarmEventForm): void;
}

export function mapStateToPropsAddEdit(state: Everything): AddEditFarmEventProps {

  let handleTime = (e: React.SyntheticEvent<HTMLInputElement>, currentISO: string) => {
    // Am I really doing this right now? How else?
    let incomingTime = e.currentTarget.value.split(":");
    let hours = parseInt(incomingTime[0]) || 0;
    let minutes = parseInt(incomingTime[1]) || 0;

    switch (e.currentTarget.name) {
      case "start_time":
        // Put the current ISO established by the date field into a var
        let currentStartISO = new Date((currentISO || "").toString())
          .toISOString();

        // Set the time of the already existing iso string
        let newStartISO = moment(currentStartISO)
          .set("hours", hours)
          .set("minutes", minutes)
          .toISOString();

        return newStartISO;

      // break;
      case "end_time":
        let currentEndISO = new Date((currentISO || "").toString())
          .toISOString();

        let newEndISO = moment(currentEndISO)
          .set("hours", hours)
          .set("minutes", minutes)
          .toISOString();

        return newEndISO;

      // break;
      default:
        throw new Error("Expected a name attribute from time field.");
    }
  };

  let formatTime = (input: string) => {
    let iso = new Date(input).toISOString();
    return moment(iso).format("HH:mm");
  };

  let formatDate = (input: string) => {
    let iso = new Date(input).toISOString();
    return moment(iso).format("YYYY-MM-DD");
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
    selectOptions.push({ label: t("REGIMENS"), heading: true, value: "Regimens" });
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (regimen.id) {
      let item = {
        label: regimen.name,
        executable_type: "Regimen",
        executable_id: regimen.id,
        value: regimen.id
      };
      selectOptions.push(item);
    }
  });

  state.sync.sequences.map((sequence, index) => {
    selectOptions.push({ label: t("SEQUENCES"), heading: true, value: "Sequences" });
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (sequence.id) {
      let item = {
        label: sequence.name,
        executable_type: "Sequence",
        executable_id: sequence.id,
        value: sequence.id
      };
      selectOptions.push(item);
    }
  });

  return {
    selectOptions,
    repeatOptions,
    formatDate,
    formatTime,
    handleTime,
    save(fe) {
      this.dispatch(saveFarmEvent(fe, () => {
        this.router.push("/app/designer/farm_events");
      }));
    }
  };
}
