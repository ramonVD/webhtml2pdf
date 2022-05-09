//BOOTSTRAP - FIX TABLES FOR PRINT

/*Sets up the background of all elements inside tables to show up when printing*/
export function setupTableElementsForPrint(htmlElement) {
    Array.from(htmlElement.getElementsByTagName("table")).forEach( 
        table => fixTableBackground(table) );
}

/*Assigns the background to each element that has one as important, so itll show up
despite the default styles applied.*/
const fixTableBackground = (table) => {
    const tableChildren = Array.from(table.querySelectorAll("tr, td, th"));
    tableChildren.forEach( tableChild => {
        if (tableChild.style.backgroundColor !== "") {
            propagateBgColorToCells(tableChild, tableChild.style.backgroundColor);
        } else {
            //Check if it has bootstrap classes applied, then set that bg color to important
            const classList = Array.from(tableChild.classList);
            if (classList.length > 0) {
                const tableClassMatch = classList.join(",").match(/table-(\w+)/);
                if (tableClassMatch && tableClassMatch[1].length > 0) {
                    const finalbgColor = getBootstrapTableColor(tableClassMatch[1]);
                    if (finalbgColor !== "") {
                        propagateBgColorToCells(tableChild, finalbgColor);
                    }
                }
            }
        }
    });
}

/*Translate table-* classes in bootstrap to their colors in hex*/
function getBootstrapTableColor(bootstrapClassName) {
    switch (bootstrapClassName) {
        case "primary":
            return "#b8daff";
        case "secondary":
            return "#d6d8db";
        case "active":
            return "#ececec";
        case "success":
            return "#c3e6cb";
        case "danger":
            return "#f5c6cb";
        case "warning":
            return "#ffeeba";
        case "info":
            return "#bee5eb";
        case "light":
            return "#fdfdfe";
        case "dark":
            return "#212529";
        default:
            return "";
      }
}

/* Applies the color to the cell or, in the case of rows, to all cells in the row.
Needed because apparently row background colors arent shown while printing? (atleast on firefox)*/
function propagateBgColorToCells(mainElement, color) {
    if (mainElement.tagName.toLowerCase() === "tr") {
        Array.from(mainElement.querySelectorAll("td, th")).forEach ( cell => {
            cell.style.setProperty("background-color", color , "important");});
    } else {
        mainElement.style.setProperty("background-color", color , "important");
    }
}

export default setupTableElementsForPrint;