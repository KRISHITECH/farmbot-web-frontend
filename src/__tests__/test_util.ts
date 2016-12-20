import {
    prettyPrintApiErrors,
    beep,
    defensiveClone,
    getParam
} from "../util";
describe("util", () => {
    describe("defensiveClone", () => {
        it("deep clones any serializable object", () => {
            let origin = { a: "b", c: 2, d: [{ e: { f: "g" } }] };
            let child = defensiveClone(origin);
            origin.a = "--";
            origin.c = 0;
            origin.d[0].e.f = "--";
            expect(child).not.toBe(origin);
            expect(child.a).toEqual("b");
            expect(child.c).toEqual(2);
            expect(child.d[0].e.f).toEqual("g");
        });
    });

    describe("getParam", () => {
        it("gets params", () => {
            Object.defineProperty(window.location, "search", {
                writable: true,
                value: "?foo=bar&baz=wow"
            });
            expect(getParam("foo")).toEqual("bar");
            expect(getParam("baz")).toEqual("wow");
            expect(getParam("blah")).toEqual("");
        });
    });

    describe("prettyPrintApiErrors", () => {
        it("handles properly formatted API error messages", () => {
            let result = prettyPrintApiErrors({
                response: {
                    data: {
                        email: "can't be blank"
                    }
                }
            });
            expect(result).toEqual("Email can't be blank.");
        });
    });

    describe("beep()", () => {
        it("¯\_(ツ)_/¯", () => {
            beep();
        });
    });
    // describe("x", () => {
    //     it("y", () => {

    //     });
    // });
});
