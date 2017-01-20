import { Regimen, RegimenItem } from "./interfaces";
import { ReduxAction } from "../redux/interfaces";
import { warning, success, error } from "../ui";
import * as Axios from "axios";
import { regimenSerializer } from "./serializers";
import { prettyPrintApiErrors } from "../util";
import { t } from "i18next";
import { API } from "../api";
import { UnsafeError } from "../interfaces";

export function copyRegimen(payload: Regimen) {
  return {
    type: "COPY_REGIMEN",
    payload
  };
}

export function editRegimen(regimen: Regimen,
  update: Object):
  ReduxAction<{ regimen: Regimen, update: Object }> {
  return {
    type: "EDIT_REGIMEN",
    payload: {
      regimen,
      update
    }
  };
}

export function saveRegimen(regimen: Regimen, baseUrl: string) {
  return function (dispatch: Function) {
    const action = regimen.id ? Axios.put : Axios.post;
    let url = API.current.regimensPath + (regimen.id || "");
    return action<Regimen>(url, regimenSerializer(regimen))
      .then(function (resp) {
        success(t("Regimen saved."));
        dispatch(saveRegimenOk(resp.data));
      })
      .catch(error => saveRegimenErr(error));
  };
}

function saveRegimenOk(regimen: Regimen) {
  return { type: "SAVE_REGIMEN_OK", payload: regimen };
}

function saveRegimenErr(err: UnsafeError) {
  error(prettyPrintApiErrors(err),
    t("Unable to save regimen."));
}

export function deleteRegimen(regimen: Regimen) {
  return function (dispatch: Function) {
    if (!confirm(`Delete regimen '${regimen.name}'?`)) {
      return;
    }

    if (regimen && regimen.id) {
      let url = API.current.regimensPath + regimen.id;

      Axios.delete<Regimen>(url)
        .then(function (resp) {
          dispatch(deleteRegimenOk(regimen));
        })
        .catch(function (error) {
          deleteRegimenErr(error);
        });
    } else {
      dispatch(deleteRegimenOk(regimen));
    };
  };
}

function deleteRegimenOk(payload: Regimen) {
  success(t("Regimen deleted."));
  return {
    type: "DELETE_REGIMEN_OK",
    payload
  };
}

function deleteRegimenErr(payload: Error) {
  error(t("Unable to delete regimen."));
}

export function newRegimen(): ReduxAction<{}> {
  return {
    type: "NEW_REGIMEN",
    payload: {}
  };
}

export function selectRegimen(index: number): ReduxAction<number> {
  return {
    type: "SELECT_REGIMEN",
    payload: index
  };
}

export function removeRegimenItem(item: RegimenItem): ReduxAction<RegimenItem> {
  return {
    type: "REMOVE_REGIMEN_ITEM",
    payload: item
  };
}

export function fetchRegimens() {
  return function (dispatch: Function) {
    return Axios
      .get<Regimen[]>(API.current.regimensPath)
      .then(r => dispatch({
        type: "FETCH_REGIMENS_OK",
        payload: r.data
      }))
      .catch(e => {
        warning(t("Could not download regimens."));
        dispatch({
          type: "FETCH_REGIMENS_ERR",
          payload: e
        });
      });
  };
};

