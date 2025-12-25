declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    export interface UserOptions {
        startY?: number;
        head?: any[][];
        body?: any[][];
        foot?: any[][];
        headStyles?: any;
        bodyStyles?: any;
        footStyles?: any;
        styles?: any;
        columnStyles?: any;
        theme?: 'striped' | 'grid' | 'plain';
        margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
        [key: string]: any;
    }

    export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
