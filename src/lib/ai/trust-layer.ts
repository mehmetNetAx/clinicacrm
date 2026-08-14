/**
 * Agentforce Trust Layer - PHI (Protected Health Information) Masking & HIPAA Compliance
 * 
 * Masking sensitive patient data before sending prompt payloads to LLMs
 * and unmasking them upon receiving the AI response.
 */

export interface PHIMaskResult {
  maskedText: string;
  phiMap: Record<string, string>;
}

export class PHITrustLayer {
  /**
   * Masks sensitive fields in a text or object payload
   */
  static maskText(text: string): PHIMaskResult {
    const phiMap: Record<string, string> = {};
    let masked = text;
    let counter = 1;

    // 1. TCKN (Turkish ID Number - 11 digits)
    masked = masked.replace(/\b[1-9]\d{10}\b/g, (match) => {
      const token = `[PHI_TCKN_${counter++}]`;
      phiMap[token] = match;
      return token;
    });

    // 2. Phone Numbers (Turkish / International formats)
    masked = masked.replace(/(?:\+?90|0)?\s*[5]\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/g, (match) => {
      const token = `[PHI_PHONE_${counter++}]`;
      phiMap[token] = match;
      return token;
    });

    // 3. Email Addresses
    masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => {
      const token = `[PHI_EMAIL_${counter++}]`;
      phiMap[token] = match;
      return token;
    });

    // 4. Passport Numbers
    masked = masked.replace(/\b[A-Z]\d{8}\b/g, (match) => {
      const token = `[PHI_PASSPORT_${counter++}]`;
      phiMap[token] = match;
      return token;
    });

    return { maskedText: masked, phiMap };
  }

  /**
   * Unmasks tokens back to original values in AI output
   */
  static unmaskText(maskedText: string, phiMap: Record<string, string>): string {
    let unmasked = maskedText;
    for (const [token, originalValue] of Object.entries(phiMap)) {
      unmasked = unmasked.replaceAll(token, originalValue);
    }
    return unmasked;
  }

  /**
   * Sanitizes patient object for safe AI reasoning prompt
   */
  static sanitizePatientObject(patient: any): { sanitizedPatient: any; phiMap: Record<string, string> } {
    const phiMap: Record<string, string> = {};
    const sanitized = { ...patient };

    if (sanitized.name) {
      const token = `[PATIENT_NAME]`;
      phiMap[token] = sanitized.name;
      sanitized.name = token;
    }
    if (sanitized.phone) {
      const token = `[PATIENT_PHONE]`;
      phiMap[token] = sanitized.phone;
      sanitized.phone = token;
    }
    if (sanitized.email) {
      const token = `[PATIENT_EMAIL]`;
      phiMap[token] = sanitized.email;
      sanitized.email = token;
    }

    return { sanitizedPatient: sanitized, phiMap };
  }
}
