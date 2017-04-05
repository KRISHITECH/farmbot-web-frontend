import { SendMessage, Channel } from "farmbot/dist";
import * as React from "react";

/** Communication channels that we hope to support one day, but don't today. */
export const DISABLED = ["email", "sms", "twitter"]
export const THE_ONLY_CHANNEL: Channel = {
  kind: "channel",
  args: {
    channel_name: "toast"
  }
};
export const CHANNELS = _.pairs<{}, string>({
  "toast": "Toast Notification",
  "email": "Email",
  "sms": "SMS",
  "twitter": "Twitter"
});
export const MESSAGE_STATUSES = [
  { value: "success", label: "Success" },
  { value: "busy", label: "Busy" },
  { value: "warn", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "info", label: "Info" },
  { value: "fun", label: "Fun" }
];

interface ChoiceProps {
  currentStep: SendMessage;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

export let ChannelChoices = ({
      currentStep,
  onChange
}: ChoiceProps) => {
  return <div>{CHANNELS.map(function (pair, key) {
    let name_list = (currentStep.body || []).map(x => x.args.channel_name);
    let [name, label] = pair;
    return <fieldset key={key}>
      <label htmlFor={name}> {label}</label>
      <input type="checkbox"
        id={name}
        disabled={DISABLED.includes(name)}
        onChange={onChange}
        checked={name_list.includes(name)}
      />
    </fieldset>;
  })}</div>;
}
