import { getParam } from "../util";
import { put } from "axios";
import { API } from "../api/api";
import { Session } from "../session";

export async function verify() {
    const token = getParam('token');
    const url = API.fetchBrowserLocation();
    let { data } = await put(url + "/api/users/verify/" + token) as any;
    Session.put(data);
    window.location.href = "/app/controls";
}

verify();
