//It shouldnt be an exported function, but I need to export for tests...
import { fixIndexLinks } from "../components/htmlEdition/modules/editIOCStructures"

it ("Removes hrefs from links in the index of a IOC book", () => {
        const input = document.createElement("html");
        //emulate a IOC book structure with bogus link elements
        input.innerHTML = (
        `<html>
            <head><title>test</title>
            <body>
                <div class="book_toc_ordered">
                    <a name="toc"></a>
                    <a name="toc2" href="#">
                    <a href="#ch12415415"></a>
                    <a href="someWeirdValue"></a>
                    <a id="34" href="#ar1241">aaaa</a>
                    <a href="#ch12415415">bbbbb</a>
                </div>
            </body>
        </html>`);

        fixIndexLinks(input);

        let results = Array.from(input.querySelectorAll("a")).filter( el => {
            return el.getAttribute("href") !== null} );

        expect(results).toEqual([]);
});