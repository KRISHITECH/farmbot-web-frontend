import * as React from "react";
import { PeripheralList } from "./peripheral_list";
import { PeripheralForm } from "./peripheral_form";
import { Widget, WidgetBody, WidgetHeader, error } from "../../ui";
import { PeripheralsProps } from "../../devices/interfaces";
import { PeripheralState } from "./interfaces";
import { t } from "i18next";
import { TaggedPeripheral } from "../../resources/tagged_resources";
import { saveAll, init } from "../../api/crud";

const HELP_TEXT = `Use these toggle switches to control FarmBot's peripherals in 
realtime. To edit and create new peripherals, press the EDIT button. Make 
sure to turn things off when you're done!`

export class Peripherals extends React.Component<PeripheralsProps, PeripheralState> {
  constructor() {
    super();
    this.state = { isEditing: false };
  }

  toggle = () => {
    this.setState({ isEditing: !this.state.isEditing });
  }

  maybeSave = () => {
    let { peripherals } = this.props;
    let pinNums = peripherals.map(x => x.body.pin);
    let positivePins = pinNums.filter(x => x && x > 0);
    // I hate adding client side validation, but this is a wonky endpoint - RC.
    let allAreUniq = _.uniq(pinNums).length === pinNums.length;
    let allArePositive = positivePins.length === pinNums.length
    if (allAreUniq && allArePositive) {
      this.props.dispatch(saveAll(this.props.peripherals, this.toggle));
    } else {
      error("Pin numbers are required and must be unique.");
    }
  }

  showPins = () => {
    let { peripherals, dispatch, bot } = this.props;

    let pins = bot.hardware.pins;
    if (this.state.isEditing) {
      return <PeripheralForm peripherals={peripherals}
        dispatch={dispatch} />
    } else {
      return <PeripheralList peripherals={peripherals}
        dispatch={dispatch}
        pins={pins} />
    }
  }

  emptyPeripheral = (): TaggedPeripheral => {
    return {
      uuid: "WILL_BE_CHANGED_BY_REDUCER",
      kind: "peripherals",
      body: { pin: 0, label: "New Peripheral" }
    }
  }

  render() {
    let { dispatch, peripherals } = this.props;
    let { isEditing } = this.state;

    let isSaving = peripherals && peripherals
      .filter(x => x.saving).length !== 0;

    let isDirty = peripherals && peripherals
      .filter(x => x.dirty).length !== 0;

    return <Widget>
      <WidgetHeader title={"Peripherals"}
        helpText={HELP_TEXT}>
        <button
          hidden={isEditing}
          className="gray button-like"
          type="button"
          onClick={this.toggle}>
          {t("Edit")}
        </button>
        <button
          hidden={!isEditing}
          className={`green button-like is-saving-${isSaving}`}
          type="button"
          onClick={this.maybeSave}>
          {t("Save")} {isDirty && !isSaving && ("*")}
        </button>
        <button
          hidden={!isEditing}
          className="green button-like"
          type="button"
          onClick={() => { dispatch(init(this.emptyPeripheral())) }}>
          <i className="fa fa-plus" />
        </button>
      </WidgetHeader>
      <WidgetBody>
        {this.showPins()}
      </WidgetBody>
    </Widget>;
  };
}
