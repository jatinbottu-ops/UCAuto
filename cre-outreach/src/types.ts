// Shared types for the outreach pipeline.

/** A single email candidate returned by Hunter.io for a domain. */
export interface Contact {
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  seniority: string | null; // "junior" | "senior" | "executive" | null
  department: string | null;
  /** Hunter's confidence the address is valid, 0-100. */
  confidence: number;
  /** "personal" | "generic" (e.g. info@, sales@). */
  type: string | null;
  /** Our computed relevance score (higher is better). */
  score: number;
  /** Human-readable explanation of why this contact scored the way it did. */
  scoreReasons: string[];
}

export type RecordStatus =
  | "pending" // not yet enriched
  | "enriched" // best contact found
  | "low_confidence" // contact found but below MIN_CONFIDENCE
  | "no_contact" // Hunter returned nothing usable
  | "generated" // email written
  | "drafted" // Gmail draft created
  | "error";

export interface GeneratedEmail {
  subject: string;
  body: string;
}

/** The full state we track per input domain. This is the source of truth. */
export interface OutreachRecord {
  domain: string;
  company: string | null;
  status: RecordStatus;
  /** The chosen best contact, if any. */
  contact: Contact | null;
  /** Other candidates we considered, best-first (capped). */
  alternates: Contact[];
  /** The generated email (mirrors the editable .md file). */
  email: GeneratedEmail | null;
  /** Path to the editable markdown file for this record's email. */
  emailFile: string | null;
  /** Gmail draft id once created. */
  gmailDraftId: string | null;
  notes: string;
  updatedAt: string;
}
