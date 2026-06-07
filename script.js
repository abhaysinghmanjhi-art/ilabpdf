// ---------- ELEMENTS ----------
const fileInput = document.getElementById("imageInput");
const previewBox = document.getElementById("previewBox");
const previewList = document.getElementById("previewList");
const pdfReadyBox = document.getElementById("pdfReady");
const downloadBtn = document.getElementById("downloadBtn");

// ---------- SHOW PREVIEW ----------
fileInput.addEventListener("change", function () {

```
let files = fileInput.files;

if (files.length === 0) return;

previewBox.style.display = "block";
pdfReadyBox.style.display = "none";
previewList.innerHTML = "";

[...files].forEach(file => {

    let reader = new FileReader();

    reader.onload = function (e) {

        let div = document.createElement("div");

        div.style.margin = "12px 0";
        div.style.textAlign = "center";

        div.innerHTML = `
            <p style="color:#4ea1ff;font-size:14px;margin-bottom:5px;">
                ${file.name}
            </p>

            <img
                src="${e.target.result}"
                style="max-width:100%;border-radius:8px;"
            >
        `;

        previewList.appendChild(div);
    };

    reader.readAsDataURL(file);

});
```

});

// ---------- CONVERT TO PDF ----------
async function convertToPDF() {

```
const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

let files = fileInput.files;

if (files.length === 0) {

    alert("Please select at least one image.");

    return;
}

previewBox.style.display = "none";

for (let i = 0; i < files.length; i++) {

    let img = await readFileAsDataURL(files[i]);

    if (i > 0) {
        pdf.addPage();
    }

    pdf.addImage(
        img,
        "JPEG",
        10,
        10,
        190,
        270
    );
}

const blobPDF = pdf.output("blob");

const pdfUrl = URL.createObjectURL(blobPDF);

downloadBtn.onclick = function () {

    const a = document.createElement("a");

    a.href = pdfUrl;

    a.download = "ilabpdf-jpg-to-pdf.pdf";

    a.click();
};

pdfReadyBox.style.display = "block";
```

}

// ---------- READ FILE ----------
function readFileAsDataURL(file) {

```
return new Promise((resolve) => {

    let reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.readAsDataURL(file);

});
```

}
