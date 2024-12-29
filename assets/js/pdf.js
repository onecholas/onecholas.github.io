const PDFJS = window['pdfjs-dist/build/pdf'];
// Note: Worker version should be same to pdf-js
PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

const pdf_url = "../assets/Nicholas_Hsu_Aug_23.pdf"

let __PDF_DOC;
const __CANVAS = document.getElementById("pdf-canvas"); // Add a canvas with this ID to your HTML
const __CANVAS_CTX = __CANVAS.getContext("2d");

PDFJS.getDocument({ url: pdf_url }).promise.then(function (pdf_doc) {
    __PDF_DOC = pdf_doc;
    // Do things...
    // Show the first page
    showPage(1);
}).catch(function (error) {
    // An error occurred
});

function showPage(page_no) {
    // ...

    // Fetch the page
    __PDF_DOC.getPage(page_no).then(function (page) {
        // Get viewport of the page at required scale
        let viewport = page.getViewport({
            scale: 1,
        });

        // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
        let scale = __CANVAS.width / viewport.width;
        viewport = page.getViewport({
            scale: scale
        });

        // Set canvas height
        __CANVAS.height = viewport.height;

        var renderContext = {
            canvasContext: __CANVAS_CTX,
            viewport: viewport
        };

        // Render the page contents in the canvas
        page.render(renderContext).promise.then(function () {
            // ...

            // Return the text contents of the page after the pdf has been rendered in the canvas
            return page.getTextContent();
        }).then(function (textContent) {
            // Get canvas offset
            var canvas_offset = $("#pdf-canvas").offset();

            // Clear HTML for text layer
            $("#text-layer").html('');

            // Assign the CSS created to the text-layer element
            document.getElementById('text-layer').style.setProperty('--scale-factor', viewport.scale);
            $("#text-layer").css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px'});

            // Pass the data to the method for rendering of text over the pdf canvas.
            PDFJS.renderTextLayer({
                textContentSource: textContent,
                container: $("#text-layer").get(0),
                viewport: viewport,
                textDivs: []
            });
        });
    });
}