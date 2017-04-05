import { ReduxAction, Thunk } from "../../redux/interfaces";
import { SetTimeOffsetProps, ToggleDayParams } from "./interfaces";
import { assertUuid, findSequence, findRegimen } from "../../resources/selectors";
import { groupRegimenItemsByWeek } from "./group_regimen_items_by_week";
import { newRegimen } from "../actions";
import { error } from "../../ui/index";
import { t } from "i18next";
import { defensiveClone } from "../../util";
import { overwrite } from "../../api/crud";

export function pushWeek() {
  return {
    type: "PUSH_WEEK"
  };
}

export function popWeek() {
  return {
    type: "POP_WEEK"
  };
}

const MINUTES_MS = 1000 * 60;
const HOURS_MS = MINUTES_MS * 60;

/** Sets daily offset of a regimen */
export function setTimeOffset({ hours, minutes }: SetTimeOffsetProps) {
  // let milliseconds = [hours * HOURS_MS, minutes * MINUTES_MS]
  //   .reduce((num, acc) => num + acc);

  // if (_.isNaN(milliseconds) || !_.isNumber(milliseconds)) {
  //   let m = "Time is not properly formatted.";
  //   warning(m, "Bad Input");
  //   return {
  //     type: "TIME_OFFSET_ERROR",
  //     payload: 0
  //   };

  // } else {
  return {
    type: "SET_TIME_OFFSET",
    payload: [] // bulk_scheduler/actions.ts
  };
  // };
}

export function toggleDay({ week, day }: ToggleDayParams) {
  return {
    type: "TOGGLE_DAY",
    payload: {
      week,
      day
    }
  };
}

export function setSequence(uuid: string): ReduxAction<string> {
  assertUuid("sequences", uuid);
  return { type: "SET_SEQUENCE", payload: uuid };
};

export function commitBulkEditor(): Thunk {

  return function (dispatch, getState) {
    let res = getState().resources;
    let { weeks, dailyOffsetMs, selectedSequenceUUID, currentRegimen } =
      res.consumers.regimens;

    // If the user hasn't clicked a regimen, initialize one for them.
    if (!currentRegimen) {
      dispatch(newRegimen());
      currentRegimen = getState().resources.consumers.regimens.currentRegimen
        || "Impossible UUID";
    }

    // Proceed only if they selected a sequence from the drop down.
    if (selectedSequenceUUID) {
      let seq = findSequence(res.index, selectedSequenceUUID).body;
      const regimenItems = groupRegimenItemsByWeek(weeks, dailyOffsetMs, seq);
      let reg = findRegimen(res.index, currentRegimen);
      let update = defensiveClone(reg).body;
      update.regimen_items = update.regimen_items.concat(regimenItems);
      dispatch(overwrite(reg, update));
    } else {
      error(t("Select a sequence from the dropdown first."));
    }
  };
}
