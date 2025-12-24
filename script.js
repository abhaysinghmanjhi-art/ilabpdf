// MAIN JPG → PDF FUNCTION
async function convertToPDF() {
    const { jsPDF } = window.jspdf;

    let files = document.getElementById("images").files;

    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    // A4 portrait size PDF
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    for (let i = 0; i < files.length; i++) {
        let imgData = await readFileAsDataURL(files[i]);

        let img = new Image();
        img.src = imgData;

        await new Promise(resolve => img.onload = resolve);

        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = img.width;
        let imgHeight = img.height;

        let scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

        let finalWidth = imgWidth * scale;
        let finalHeight = imgHeight * scale;

        let x = (pageWidth - finalWidth) / 2;
        let y = (pageHeight - finalHeight) / 2;

        if (i > 0) pdf.addPage();

        pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
    }

    pdf.save("converted.pdf");
}

function readFileAsDataURL(file) {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}
