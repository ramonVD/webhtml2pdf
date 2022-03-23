import { getWidthValue } from "../components/htmlEdition/aux/utils";

describe("Get attribute value", () => {
    test("It should get a DOM's element attribute value, or return 0 if it doesnt exist", () => {
        const input = document.createElement("html");
        input.innerHTML = (
        `<html>
            <head><title>test</title>
            <body>
                <img src="1" id="1" />
                <img src="2" id="2" width="12" />
                <img src="3" id="3" style="width:12px;" />
                <img src="4" id="4" style="width:100%;" />
                <img src="5" id="5" style="width:60vw;" />
                <img src="5" id="5" style="width:35em;" />
                <img src="6" id="6" style="width: fit-content" />
                <img src="7" id="7" style="width: auto; max-width:100vw;" />
            </body>
        </html>`);
        const results = Array.from(input.querySelectorAll("img")).map( el => {
            return getWidthValue(el, "width");
        });

        const desiredOutput = ["0", "12", "12", "0", "0", "0", "0", "0"];

        expect(results).toEqual(desiredOutput);

    });
});