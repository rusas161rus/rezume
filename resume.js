const downloadButton = document.querySelector("#download-pdf");

function buildPdfContent() {
    const blocks = [];

    const elements = document.querySelectorAll(
        "main h2, main h3, main p, main ul"
    );

    for (const element of elements) {
        if (element.tagName === "UL") {
            const items = [];

            for (const item of element.children) {
                const entry = {
                    text: item.innerText.trim(),
                    margin: [0, 0, 0, 4]
                };

                const link = item.querySelector("a");

                if (link) {
                    entry.link = link.href;
                    entry.color = "#2457a7";
                    entry.decoration = "underline";
                }

                items.push(entry);
            }

            blocks.push({
                ul: items,
                margin: [0, 0, 0, 8]
            });
        } else {
            const block = {
                text: element.innerText.trim(),
                margin: [0, 0, 0, 6]
            };

            if (element.tagName === "H2") {
                block.fontSize = 14;
                block.bold = true;
                block.margin = [0, 12, 0, 6];
            } else if (element.tagName === "H3") {
                block.fontSize = 11;
                block.bold = true;
                block.margin = [0, 8, 0, 4];
            }

            blocks.push(block);
        }
    }

    return blocks;
}

async function prepareResume() {
    const name = document.querySelector("h1").innerText;
    const role = document.querySelector(".role").innerText;
    const resumeContent = buildPdfContent();
    const language = document.documentElement.lang;

    const photo = document.querySelector(".profile-photo");

    await photo.decode();

    const canvas = document.createElement("canvas");
    canvas.width = photo.naturalWidth;
    canvas.height = photo.naturalHeight;

    const context = canvas.getContext("2d");
    context.drawImage(photo, 0, 0);

    const photoData = canvas.toDataURL("image/jpeg", 0.9);

    const pdfDocument = {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 60],
        
        defaultStyle: {
            font: "Roboto",
            fontSize: 10,
            lineHeight: 1.2
    },

    content: [
    {
        columns: [
            {
                width: "*",
                stack: [
                    {
                        text: name,
                        fontSize: 20,
                        bold: true,
                        margin: [0, 0, 0, 6]
                    },
                    {
                        text: role,
                        fontSize: 14
                    }
                ]
            },
            {
                image: photoData,
                width: 100
            }
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20]
    },
    {
        stack: resumeContent
    }
]   

    //console.log("Имя:", name);
    //console.log("Должность:", role);
    //console.log("Язык:", language);
    //console.log("Содержимое резюме:", resumeText);
};

await pdfMake.createPdf(pdfDocument).download("resume-" + language + ".pdf");
};

downloadButton.addEventListener("click", prepareResume);