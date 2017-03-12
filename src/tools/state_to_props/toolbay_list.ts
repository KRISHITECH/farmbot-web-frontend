import { ToolBay, ToolSlot } from "../interfaces";
import { Everything } from "../../interfaces";

export interface ToolBayListProps {
  toolBays: ToolBay[];
  toolSlots: ToolSlot[];
}

export function mapStateToProps(props: Everything): ToolBayListProps {

  return {
    toolBays: [],
    toolSlots: []
  };

}
