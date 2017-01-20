import * as React from "react";
import { performSeq } from "../sequence_editor_middle";
import { Color } from "farmbot";
import { devices } from "../../device";
const blue: Color = "blue";
const sequence: "sequence" = "sequence";

describe("performSeq()", function () {
    it("saves new user password", function () {
        devices.current.publish = jest.fn();
        devices.current.send = jest.fn();
        let seq = {
            color: blue,
            kind: sequence,
            name: "wow",
            dirty: true,
            args: { version: 9 },
            body: []
        };
        let spy = jest.fn(function () {
            return Promise.resolve();
        });
        let innerFunction = performSeq(spy, seq);
        expect(spy).not.toHaveBeenCalled();
        innerFunction();
        expect(spy).toHaveBeenCalled();
        expect(true).toBeTruthy();
    });
});
