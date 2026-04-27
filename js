async function processPdf(type) {
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput.files.length === 0) {
        alert("먼저 PDF 파일을 선택해주세요!");
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    
    // PDF 로드
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const newPdf = await PDFLib.PDFDocument.create();
    const pageCount = pdfDoc.getPageCount();
    const pages = [];

    if (type === 'odd') {
        // 홀수 페이지 추출 (1, 3, 5...)
        for (let i = 0; i < pageCount; i += 2) {
            pages.push(i);
        }
    } else {
        // 짝수 페이지 추출 (..., 6, 4, 2) - 역순으로 뽑아야 종이 순서가 맞음
        for (let i = (pageCount % 2 === 0 ? pageCount - 1 : pageCount - 2); i >= 1; i -= 2) {
            pages.push(i);
        }
    }

    const copiedPages = await newPdf.copyPages(pdfDoc, pages);
    copiedPages.forEach(page => newPdf.addPage(page));

    // 파일 다운로드 및 인쇄창 유도
    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // 새 창에서 열어서 바로 인쇄하게 함
    const win = window.open(url);
    win.onload = () => {
        win.print();
    };
}

// 파일 선택 시 컨트롤 화면 보여주기
document.getElementById('pdf-upload').addEventListener('change', () => {
    document.getElementById('controls').classList.remove('hidden');
});
