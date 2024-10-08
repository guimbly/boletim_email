const puppeteer = require("puppeteer");

async function generatePDF(studentId: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 400,
    height: 1120,
  });

  const url = `http://localhost:3000/report/${studentId}`;

  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

  const pdfBuffer = await page.pdf({
    printBackground: true,
    width:'400px',
    margin: {
      top: '0mm',          // Margem superior
      bottom: '0mm',       // Margem inferior
      left: '0mm',         // Margem esquerda
      right: '0mm'
    },
    height: '1120px'
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}

export default generatePDF;
