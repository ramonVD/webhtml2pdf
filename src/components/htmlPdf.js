import { jsPDF } from "jspdf";

export const converToPdf = (htmlElement) => {
    const options = {};
    const doc = new jsPDF({options});
    doc.html(htmlElement, {
        callback: function (doc) {
            doc.save('doc.pdf');
        }
    });

}

export default converToPdf;