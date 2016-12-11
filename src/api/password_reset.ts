import { API } from "./api";
import * as Axios from "axios";

interface PasswordResetPayload {
    password: string;
    password_confirmation: string;
    token: string;
}

export namespace PasswordReset {
    /** Reset a user's password from password_reset */
    export function reset(data: PasswordResetPayload) {
        return Axios.post<{}>(API.current.passwordResetPath, data);
    }
};
