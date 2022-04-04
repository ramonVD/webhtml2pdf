import { copyStyles } from "../components/htmlEdition/aux/utils";

it ("Copies the styles of a target element into another", () => {
    const input = document.createElement("html");
    //emulate a IOC book structure with bogus link elements
    input.innerHTML = (
    `<html>
        <head><title>test</title>
        <body>
            <iframe id="base" style='width:640px;height:340px;background-color:red;'></iframe>
            <iframe id="target" style='background-color:blue;' ></iframe>
        </body>
    </html>`);

    const baseIframe = input.querySelector("#base");
    const targetIframe = input.querySelector("#target");
    copyStyles(baseIframe, targetIframe)

    expect(targetIframe.style.backgroundColor).toEqual("red");
    expect(targetIframe.style.width).toEqual("640px");
});