const imageInput = document.getElementById("imageInput");
const convertBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

let generatedPdf = null;

// Preview Images
imageInput.addEventListener("change", () => {

```
preview.innerHTML = "";
downloadBtn.style.display = "none";
generatedPdf = null;

const files = imageInput.files;

if (!files.length) return;

Array.from(files).forEach(file => {

    const reader = new FileReader();

    reader.onload = function(e){

        const img = document.createElement("img");

        img.src = e.target.result;

        img.style.maxWidth = "120px";
        img.style.margin = "8px";
        img.style.borderRadius = "10px";

        preview.appendChild(img);
    };

    reader.readAsDataURL(file);

});
```

});

// Convert JPG To PDF
convertBtn.addEventListener("click", async () => {

```
const files = imageInput.files;

if(!files.length){
    alert("Please select JPG images");
    return;
}

status.innerText = "Creating PDF...";

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

for(let i = 0; i < files.length; i++){

    const file = files[i];

    const imageData = await fileToDataURL(file);

    const img = await loadImage(imageData);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(
        pageWidth / img.width,
        pageHeight / img.height
    );

    const imgWidth = img.width * ratio;
    const imgHeight = img.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    if(i > 0){
        pdf.addPage();
    }

    pdf.addImage(
        imageData,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight
    );
}

generatedPdf = pdf;

status.innerText = "PDF Ready ✔";

downloadBtn.style.display = "block";
```

});

// Download PDF
downloadBtn.addEventListener("click", () => {

```
if(!generatedPdf) return;

generatedPdf.save("ilabpdf-jpg-to-pdf.pdf");
```

});

// Helper Functions
function fileToDataURL(file){

```
return new Promise((resolve) => {

    const reader = new FileReader();

    reader.onload = e => resolve(e.target.result);

    reader.readAsDataURL(file);

});
```

}

function loadImage(src){

```
return new Promise((resolve) => {

    const img = new Image();

    img.onload = () => resolve(img);

    img.src = src;

});
```

}
