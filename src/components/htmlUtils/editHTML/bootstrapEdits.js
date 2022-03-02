/*functions to fix some bootstrap idiosincracies when printing*/
 
/*Assigns the background to each element that has one as important, so itll show up
despite the default styles applied.*/
const fixTableBackground = (table) => {
    const tableChildren = Array.from(table.querySelectorAll("tr, td, th"));
    tableChildren.forEach( tableChild => {
        if (tableChild.style.backgroundColor !== "") {
            tableChild.style.setProperty("background-color", tableChild.style.backgroundColor , "important");
        } else {
            //Check if it has bootstrap classes applied, then set that bg color to important
            const classList = Array.from(tableChild.classList);
            if (classList.length > 0) {
                const tableClassMatch = classList.join(",").match(/table-(\w+)/);
                if (tableClassMatch && tableClassMatch[1].length > 0) {
                    //match a la posicio 1 és el tipus de bg:
                    const finalbgColor = getBootstrapTableColor(tableClassMatch[1]);
                    if (finalbgColor !== "") {
                        //Check if its a row or a single cell
                        if (tableChild.tagName.toLowerCase() === "tr") {
                            Array.from(tableChild.querySelectorAll("td, th")).forEach ( cell => {
                                cell.style.setProperty("background-color", finalbgColor , "important");});
                        } else {
                            tableChild.style.setProperty("background-color", finalbgColor , "important");
                        }
                    }
                }
            }
        }
    });
}

/*Sets up the background of all elements inside tables to show up when printing*/
function setupTableElementsForPrint(htmlElement) {
  Array.from(htmlElement.getElementsByTagName("table")).forEach( table => fixTableBackground(table) );
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

export default setupTableElementsForPrint;