import fixDropdowns from "../components/htmlEdition/modules/editBootstrapDropdowns";

it ("Removes dropdown-menu elements from inside the dropdown element, inserts them afterwards", () => {
    const input = document.createElement("html");
    input.innerHTML = (
    `<html>
        <head><title>test</title>
        <body>
            <!-- Bootstrap 4.0+ dropdowns... --!>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown button
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>
                </div>
            </div>
            <!-- Bootstrap 3.3- dropdowns... --!>
            <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Dropdown
                <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="#">Separated link</a></li>
                </ul>
            </div>
        </body>
    </html>`);

    fixDropdowns(input);

    //dropdown-menu elements are not inside dropdown elements now
    const notInsideResults = Array.from(input.querySelectorAll(".dropdown-menu")).filter( el => {
        return el.parentNode.classList.contains("dropdown");
    });

    //dropdown-menu elements are now positioned exactly after the dropdown element
    const posAfterDropdownResults = Array.from(input.querySelectorAll(".dropdown")).filter( (dropdown) => {
        return !dropdown.nextElementSibling.id.match(/ddcontent\d*/);
    });

    expect(notInsideResults).toEqual([]);
    expect(posAfterDropdownResults).toEqual([]);
});