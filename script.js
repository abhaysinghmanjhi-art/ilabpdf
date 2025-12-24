// ---------- ELEMENTS ----------
const fileInput = document.getElementById("images");
const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");
const fileNameText = document.getElementById("fileName");
const pdfReadyBox = document.getElementById("pdfReady");
const downloadBtn = document.getElementById("downloadBtn");

// ---------- SHOW PREVIEW ----------
fileInput.addEventListener("change", function () {
    let file = fileInput.files[0];

    if (!file) return;

    // Preview Show
    previewBox.style.display = "block";
    pdfReadyBox.style.display = "none";

    // File Name
    fileNameText.innerText = "Selected: " + file.name;

    // Image Read
    let reader = new FileReader();
    reader.onload = function (e) {
        previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});


// ---------- CONVERT TO PDF ----------
async function convertToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let files = fileInput.files;
    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    // Hide preview – show loading?
    previewBox.style.display = "none";

    for (let i = 0; i < files.length; i++) {
        let imgData = await readFileAsDataURL(files[i]);

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
    }

    // Create Blob URL for download button
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "converted.pdf";
        a.click();
    };

    // Show PDF Ready box
    pdfReadyBox.style.display = "block";
}


// ---------- READ FILE AS BASE64 ----------
function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}
