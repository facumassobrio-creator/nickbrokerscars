export const WHATSAPP_CONTACT_NUMBER = '543794406993';

export function buildWhatsAppUrl(message?: string): string {
  if (!message) {
    return `https://wa.me/${WHATSAPP_CONTACT_NUMBER}`;
  }

  return `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function trackWhatsAppClick(eventKey: string): void {
  console.log(`[whatsapp_click] ${eventKey}`);
}
