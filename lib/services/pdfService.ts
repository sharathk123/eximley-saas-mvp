import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export interface PDFQuotationData {
    quotationNo: string;
    date: string;
    buyer: {
        name: string;
        address: string;
    };
    seller: {
        name: string;
        address: string;
        logo?: string;
    };
    items: {
        description: string;
        quantity: string;
        unitPrice: string;
        total: string;
    }[];
    terms: {
        incoterms: string;
        payment: string;
        validity: string;
    };
    currency: string;
}

export function generateQuotationPDF(data: PDFQuotationData): string {
    const doc = new jsPDF();

    // Branding Colors
    const primaryColor = [79, 70, 229]; // Indigo-600

    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 105, 25, { align: 'center' });

    // Company Info
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM:', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(data.seller.name, 20, 55);
    doc.text(data.seller.address.split('\n'), 20, 60);

    // Buyer Info
    doc.setFont('helvetica', 'bold');
    doc.text('TO:', 120, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(data.buyer.name, 120, 55);
    doc.text(data.buyer.address.split('\n'), 120, 60);

    // Quotation Metadata
    doc.setFont('helvetica', 'bold');
    doc.text(`No: ${data.quotationNo}`, 20, 85);
    doc.text(`Date: ${data.date}`, 120, 85);

    // Table
    doc.autoTable({
        startY: 95,
        head: [['Description', 'Quantity', `Unit Price (${data.currency})`, `Total (${data.currency})`]],
        body: data.items.map(item => [
            item.description,
            item.quantity,
            item.unitPrice,
            item.total
        ]),
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Commercial Terms
    doc.setFont('helvetica', 'bold');
    doc.text('COMMERCIAL TERMS', 20, finalY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Incoterms: ${data.terms.incoterms}`, 20, finalY + 7);
    doc.text(`Payment Terms: ${data.terms.payment}`, 20, finalY + 14);
    doc.text(`Validity: ${data.terms.validity}`, 20, finalY + 21);

    // Footer / Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated quotation for export assessment.', 105, 285, { align: 'center' });
    doc.text('Eximley AI Agent Protocol v2.5', 105, 290, { align: 'center' });

    // Return data URL for preview/download
    return doc.output('datauristring');
}
