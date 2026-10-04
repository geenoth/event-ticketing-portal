import { jsPDF } from 'jspdf';
import { StoryConfig, UserSelections } from '../types/dateStory';

// Clean text helper to strip unicode characters that standard PDF fonts cannot render
function sanitizeForPdf(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // remove surrogate pairs (emojis)
    .replace(/[^\x00-\x7F]/g, ' ') // replace non-ASCII characters with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

export function downloadDatePassPdf(
  config: StoryConfig,
  selections: UserSelections,
  formattedDayStr: string
): boolean {
  try {
    // A5 Landscape dimensions: 210mm wide x 148mm tall
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5',
    });

    const pageWidth = 210;
    const pageHeight = 148;

    // 1. Dark Theme Card Background (#0f0b12)
    doc.setFillColor(15, 11, 18);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. Outer Border with rounded corners
    doc.setDrawColor(244, 114, 182); // Rose-400
    doc.setLineWidth(0.6);
    doc.roundedRect(6, 6, pageWidth - 12, pageHeight - 12, 3, 3, 'S');

    // 3. Top Holographic Gradient Bar
    doc.setFillColor(244, 63, 94); // Rose-500
    doc.rect(7, 7, pageWidth - 14, 2, 'F');

    // 4. Ticket Header: Left Side (Icon Box + Titles)
    doc.setFillColor(35, 18, 28);
    doc.setDrawColor(244, 114, 182);
    doc.setLineWidth(0.3);
    doc.roundedRect(12, 11.5, 9, 9, 1.5, 1.5, 'FD');

    // Ticket icon symbol inside box
    doc.setTextColor(244, 114, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('*', 15.5, 17.5);

    // Kicker & Main Title
    doc.setTextColor(253, 164, 175); // Rose-300
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(
      `DATE PASS · ${config.recipientName.toUpperCase()} & ${config.senderName.toUpperCase()}`,
      24,
      14.5
    );

    doc.setTextColor(255, 241, 242);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Afternoon Date & Ocean Breeze', 24, 19.5);

    // 5. Header Right Side: EXACT FRONTEND "CONFIRMED" CHIP
    const statusX = pageWidth - 48;

    // Status label
    doc.setTextColor(168, 162, 158); // Stone-400
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('STATUS', statusX + 16, 13.5);

    // Exact frontend oval pill: dark emerald background with emerald border
    doc.setFillColor(6, 40, 32); // Emerald-950/80
    doc.setDrawColor(52, 211, 153); // Emerald-400 border
    doc.setLineWidth(0.3);
    doc.roundedRect(statusX + 2, 15, 32, 5.5, 2.7, 2.7, 'FD');

    // Glowing green circular dot
    doc.setFillColor(52, 211, 153);
    doc.circle(statusX + 6, 17.75, 0.8, 'F');

    // "CONFIRMED" text inside chip
    doc.setTextColor(52, 211, 153);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('CONFIRMED', statusX + 8.5, 18.8);

    // Header divider line
    doc.setDrawColor(244, 63, 94);
    doc.setLineWidth(0.25);
    doc.line(10, 22.5, pageWidth - 10, 22.5);

    // 6. Two-Column PC View Grid: Left details (width: 128mm), Right stub (width: 54mm)
    const leftX = 12;

    // Destination
    doc.setTextColor(244, 114, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('DATE DESTINATION', leftX, 28);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(sanitizeForPdf(config.venueName), leftX, 33);

    doc.setTextColor(168, 162, 158);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(
      `${sanitizeForPdf(config.venueLocation)} · Rooftop sea view & ocean breeze`,
      leftX,
      37
    );

    // Timing & Date (Side-by-side like PC view)
    const col2X = leftX + 64;

    doc.setTextColor(244, 114, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('TIMING', leftX, 44);
    doc.text('DATE SELECTION', col2X, 44);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    const cleanTimeStr = sanitizeForPdf(selections.timeSlot || '3:00 PM - 5:00 PM');
    doc.text(doc.splitTextToSize(cleanTimeStr, 58), leftX, 48.5);

    doc.setTextColor(253, 224, 71); // Amber
    const cleanDateStr = sanitizeForPdf(formattedDayStr);
    doc.text(doc.splitTextToSize(cleanDateStr, 58), col2X, 48.5);

    // Experience
    doc.setTextColor(244, 114, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('EXPERIENCE', leftX, 58);

    doc.setTextColor(230, 220, 235);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Afternoon treats, sea breeze, and our custom plans', leftX, 62.5);

    // Extra Plans in Date Cart
    const cartActivities = selections.cartActivities
      .map((id) => config.dateCartActivities.find((a) => a.id === id))
      .filter(Boolean);

    doc.setTextColor(244, 114, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(
      `EXTRA PLANS IN DATE CART (${cartActivities.length})`,
      leftX,
      70
    );

    let planY = 74.5;
    if (cartActivities.length > 0) {
      let pillX = leftX;
      for (const act of cartActivities) {
        if (!act) continue;
        const cleanTitle = sanitizeForPdf(act.title);
        const pillText = cleanTitle;
        const pillWidth = doc.getTextWidth(pillText) + 5;

        if (pillX + pillWidth > 135) {
          pillX = leftX;
          planY += 6;
        }

        doc.setFillColor(32, 16, 26);
        doc.setDrawColor(244, 114, 182);
        doc.setLineWidth(0.2);
        doc.roundedRect(pillX, planY - 3.5, pillWidth, 5, 1.2, 1.2, 'FD');

        doc.setTextColor(254, 205, 211);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.text(pillText, pillX + 2.5, planY);

        pillX += pillWidth + 2.5;
      }
    } else {
      doc.setTextColor(168, 162, 158);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Just relaxing afternoon together', leftX, planY);
    }

    // Special Wish Note (if Cham wrote one)
    if (selections.specialWish && selections.specialWish.trim()) {
      const noteY = Math.max(planY + 7, 88);
      doc.setFillColor(22, 14, 25);
      doc.setDrawColor(244, 114, 182);
      doc.setLineWidth(0.2);
      doc.roundedRect(leftX, noteY, 126, 13, 1.5, 1.5, 'FD');

      doc.setTextColor(244, 114, 182);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.text("CHAM'S NOTE TO GEE:", leftX + 2.5, noteY + 4);

      doc.setTextColor(255, 240, 245);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      const cleanWish = sanitizeForPdf(selections.specialWish);
      const splitWish = doc.splitTextToSize(`"${cleanWish}"`, 120);
      doc.text(splitWish, leftX + 2.5, noteY + 8.5);
    }

    // Left Footer
    doc.setTextColor(140, 130, 150);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      `Issued with love by ${sanitizeForPdf(config.senderName)} for ${sanitizeForPdf(config.recipientName)}`,
      leftX,
      pageHeight - 9
    );

    // 7. Perforation Line (Dashed divider like PC view)
    const stubX = 144;
    doc.setDrawColor(244, 114, 182);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(stubX, 23, stubX, pageHeight - 7);
    doc.setLineDashPattern([], 0); // reset dash

    // 8. Right Column: Tear-Off Stub (PC View)
    const rightX = stubX + 4;

    doc.setTextColor(253, 164, 175);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('"Reserved With All My Love"', rightX, 30);

    doc.setTextColor(168, 162, 158);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      doc.splitTextToSize(
        'Admit Two: Cham & Gee. Smiles, sweet treats, ocean views, and the happiest afternoon!',
        50
      ),
      rightX,
      35
    );

    // Stub Checklist Box (PC View)
    doc.setFillColor(20, 13, 23);
    doc.setDrawColor(65, 28, 48);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightX, 48, 50, 25, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);

    // Row 1: Night time
    doc.setTextColor(168, 162, 158);
    doc.text('NIGHT TIME:', rightX + 2.5, 54);
    doc.setTextColor(52, 211, 153);
    const nightLabel = selections.timeSlot?.includes('Whole Day')
      ? 'NO (DAYTIME / SUNSET)'
      : 'NO (AFTERNOON ONLY)';
    doc.text(nightLabel, rightX + 22, 54);

    // Row 2: Hotel
    doc.setTextColor(168, 162, 158);
    doc.text('HOTEL:', rightX + 2.5, 61);
    doc.setTextColor(253, 164, 175);
    doc.text('MARINO BEACH', rightX + 22, 61);

    // Row 3: Happiness
    doc.setTextColor(168, 162, 158);
    doc.text('HAPPINESS:', rightX + 2.5, 68);
    doc.setTextColor(253, 224, 71);
    doc.text('GUARANTEED', rightX + 22, 68);

    // Simulated Barcode (PC View)
    doc.setDrawColor(210, 200, 220);
    const barcodeY = 82;
    const barWidths = [1, 2, 0.5, 1.5, 2.5, 1, 0.5, 2, 1.5, 1, 2.5, 0.5, 2, 1, 1.5, 2, 0.5, 2.5, 1, 1.5, 1];
    let bx = rightX + 4;
    for (const w of barWidths) {
      doc.setLineWidth(w * 0.45);
      doc.line(bx, barcodeY, bx, barcodeY + 12);
      bx += w * 0.45 + 1.25;
    }

    doc.setTextColor(168, 162, 158);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text('CHAM-AND-GEE · DATE-PASS', rightX + 6, barcodeY + 16);

    // Save PDF
    const filename = `Date-Pass-${config.recipientName}-and-${config.senderName}.pdf`;
    doc.save(filename);

    return true;
  } catch (err) {
    console.error('PDF generation error in downloadDatePassPdf:', err);
    return false;
  }
}
