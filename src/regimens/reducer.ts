import { Week } from "./bulk_scheduler/interfaces";
import { generateReducer } from "../redux/generate_reducer";
import { TaggedResource, TaggedRegimen } from "../resources/tagged_resources";
import { Dictionary } from "farmbot/dist";

export interface RegimenState {
  dailyOffsetMs: number;
  weeks: Week[];
  selectedSequenceUUID: string | undefined;
  currentRegimen: string | undefined;
}

function newWeek() {
  return {
    days: {
      day1: false,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
      day6: false,
      day7: false
    }
  };
}

function newState(): RegimenState {
  return {
    dailyOffsetMs: 300000,
    weeks: _.times(10, newWeek),
    selectedSequenceUUID: undefined,
    currentRegimen: undefined
  };
}

export let initialState: RegimenState = newState();

export let regimensReducer = generateReducer<RegimenState>(initialState)
  .add<TaggedResource>("DESTROY_RESOURCE_OK", function (state, action) {
    switch (action.payload.uuid) {
      case state.selectedSequenceUUID:
        state.selectedSequenceUUID = undefined;
        break;
      case state.currentRegimen:
        state.selectedSequenceUUID = undefined;
        break;
    }
    return state;
  })
  .add<TaggedResource>("INIT_RESOURCE", function (state, action) {
    if (action.payload.kind === "regimens") {
      state.currentRegimen = action.payload.uuid;
    }
    return state;
  })
  .add<void>("PUSH_WEEK", function (state, action) {
    state.weeks.push(newWeek());
    return state;
  })
  .add<void>("POP_WEEK", function (state, action) {
    state.weeks.pop();
    return state;
  })
  .add<{ week: number, day: number }>("TOGGLE_DAY", function (state, action) {
    let week = state.weeks[action.payload.week];
    let day = `day${action.payload.day}`;
    let days = (week.days as Dictionary<boolean>);
    days[day] = !days[day];
    return state;
  })
  .add<TaggedRegimen>("SELECT_REGIMEN", function (state, action) {
    state.currentRegimen = action.payload.uuid;
    return state;
  })
  .add<string>("SET_SEQUENCE", function (state, action) {
    state.selectedSequenceUUID = action.payload;
    return state;
  });
  // .add<number>("SET_TIME_OFFSET", function (state, action) {
  //   state.form.dailyOffsetMs = action.payload;
  //   return state;
  // })
  // .add<void>("COMMIT_BULK_EDITOR", function (state, action) {
  //   return newState();
  // })
  // .add<{ regimen: Regimen, update: Regimen }>("EDIT_REGIMEN",
  // function (state, action) {
  //   let update = {
  //     ...action.payload.regimen,
  //     ...action.payload.update,
  //     dirty: true
  //   };
  //   state.current = update;
  //   return state;
  // })
  // .add<void>("NEW_REGIMEN", function (state, action) {
  //   state.current = emptyRegimen();
  //   return state;
  // })
  // .add<Regimen>("SELECT_REGIMEN", function (state, action) {
  //   delete state.current.dirty; // ???
  //   state.current = action.payload;
  //   return state;
  // })
  // .add<Regimen>("COPY_REGIMEN", function (state, action) {
  //   // DONT COMMIT THIS CODE!!!
  //   if (_.isNumber(123)) {
  //     throw new Error("Fix this!");
  //   }
  //   // let regi = action.payload;
  //   // // Unset the ID to avoid accidentally overwriting parent.
  //   // regi.id = undefined;
  //   // regi.dirty = true;
  //   // // "My regimen (copy 1)" => "My regimen"
  //   // let baseName = regi.name.replace(/ \(copy \d*\)/, "");
  //   // // TODO: This function has string typing, regexes and inband signalling.
  //   // // I like to avoid all of those. Possible refactor target?
  //   // let copies = _.select(state.all, function (item) {
  //   //   return (item.name.indexOf(baseName) !== -1);
  //   // }).length;
  //   // // Give it a name with the (copy X) stripped out
  //   // regi.name = baseName;
  //   // // Add the (copy X) back
  //   // regi.name += ` (copy ${copies})`;
  //   // state.current = state.all.length;
  //   // state.all.push(regi);
  //   return state;
  // })
  // .add<{ index: number, regimenItems: RegimenItem[] }>
  // ("COMMIT_BULK_EDITOR", function (state, action) {
  //   let { regimenItems } = action.payload;
  //   let ok = _.cloneDeep(regimenItems);
  //   let hmm = state.current.regimen_items;
  //   state.current.dirty = true;
  //   state.current.regimen_items = hmm.concat(ok);
  //   return state;
  // });
