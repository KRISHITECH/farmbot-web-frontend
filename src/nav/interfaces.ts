import { AuthState } from "../auth/interfaces";
import { BotState } from "../devices/interfaces";
import { Log } from "../interfaces";

export interface NavButtonProps {
  auth: AuthState | undefined;
  dispatch: Function;
  bot: BotState;
  onClick?: () => void;
}

export interface DropDownProps {
  auth: AuthState | undefined;
  onClick?: () => void;
}

export interface NavBarState {
  mobileNavExpanded?: boolean;
  tickerExpanded?: boolean;
}

export interface NavBarProps {
  logs: Log[];
  bot: BotState;
  auth: AuthState | undefined;
  dispatch: Function;
}
