// ---------- ELEMENTS ----------
const fileInput = document.getElementById("images");
const previewBox = document.getElementById("previewBox");
const previewList = document.getElementById("previewList");
const pdfReadyBox = document.getElementById("pdfReady");
const downloadBtn = document.getElementById("downloadBtn");


// ---------- SHOW PREVIEW ----------
fileInput.addEventListener("change", function () {
    let files = fileInput.files;

    if (files.length === 0) return;

    previewBox.style.display = "block"; 
    pdfReadyBox.style.display = "none";
    previewList.innerHTML = "";   // Clear old previews

    // MULTIPLE IMAGE PREVIEW
    [...files].forEach(file => {
        let reader = new FileReader();
        reader.onload = function (e) {

            let div = document.createElement("div");
            div.style.marginBottom = "15px";
            div.style.textAlign = "center";

            div.innerHTML = `
                <p style="color:#4ea1ff; margin-bottom:5px; font-size:14px;">
                    ${file.name}
                </p>
                <img src="${e.target.result}" style="max-width:100%; border-radius:10px;">
            `;

            previewList.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
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

    previewBox.style.display = "none";

    for (let i = 0; i < files.length; i++) {
        let imgData = await readFileAsDataURL(files[i]);

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
    }

    // BLOB PDF
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "converted.pdf";
        a.click();
    };

    // Show Download Box
    pdfReadyBox.style.display = "block";
}



// ---------- READ FILE ----------
function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}
