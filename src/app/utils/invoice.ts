import PDFDocument from 'pdfkit';

export interface IInvoice {
    customerName: string;
    customerEmail: string;
    transactionId: string;
    date: Date;
    total: number;
    tourName: string;
    guestCount: number;
}

export async function generateInvoiceBuffer(invoice: IInvoice): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // === Header ===
        doc.fontSize(20).text('INVOICE', { align: 'right' }).moveDown();

        // === Company Info ===
        doc.fontSize(10)
            .text('Tour Management', 50, 50)
            .text('123 Road St.', 50, 65)
            .text('City, Country', 50, 80)
            .text('Email: support@tour.com', 50, 95)
            .moveDown();

        // === Customer Info ===
        doc.text(`Invoice To: ${invoice.customerName}`, 50, 140)
            .text(`Email: ${invoice.customerEmail}`, 50, 155)
            .moveDown();

        // === Invoice Details ===
        doc.text(`Invoice Number: ${invoice.transactionId}`, { align: 'right' })
            .text(`Date: ${invoice.date.toDateString()}`, { align: 'right' })
            .moveDown();

        // === Table Headers ===
        const tableTop = 200;
        const itemX = 50;
        const guestX = 300;
        const priceX = 400;

        doc.fontSize(12)
            .text('Item', itemX, tableTop)
            .text('Guests', guestX, tableTop)
            .text('Price', priceX, tableTop);

        // === Tour Info Row ===
        const rowY = tableTop + 25;
        const perGuestPrice = invoice.total / invoice.guestCount;

        doc.fontSize(12)
            .text(invoice.tourName, itemX, rowY)
            .text(invoice.guestCount.toString(), guestX, rowY)
            .text(`$${perGuestPrice.toFixed(2)}`, priceX, rowY);

        // === Total ===
        const totalY = rowY + 25;
        doc.fontSize(12)
            .text('Total:', itemX, totalY)
            .text(`$${invoice.total.toFixed(2)}`, priceX, totalY)
            .moveDown();

        // === Footer ===
        doc.fontSize(10)
            .text('Thank you for your business!', 50, totalY + 60, {
                align: 'center',
            });

        doc.end();
    });
}
