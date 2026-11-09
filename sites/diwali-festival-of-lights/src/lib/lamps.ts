// The six lamps, in festival-day order (docs/concept.md). Label schema is fixed: every lamp
// fills every field, in the same order. Stand-in wording until stage 5 writes final copy.
export type Lamp = {
  n: number;
  when: string;
  title: string;
  place: string;
  after: string;
};

export const LAMPS: Lamp[] = [
  { n: 1, when: "Dhanteras, in one tradition", title: "Lakshmi rises from the churned ocean", place: "Odisha", after: "Pattachitra" },
  { n: 2, when: "Naraka Chaturdashi, before dawn", title: "Satyabhama and Krishna defeat Narakasura", place: "Andhra Pradesh", after: "Tholu Bommalata" },
  { n: 3, when: "The new-moon night", title: "Rama comes home", place: "Bihar", after: "Madhubani" },
  { n: 4, when: "The new-moon night", title: "Mahavira's nirvana", place: "Gujarat", after: "Kalpasutra painting" },
  { n: 5, when: "The new-moon night", title: "Bandi Chhor Divas", place: "Punjab", after: "Phulkari" },
  { n: 6, when: "Padwa, the next morning", title: "King Bali comes home for a day", place: "Maharashtra", after: "Dashavatara Ganjifa" },
];

export const lampName = (l: Lamp, lit: boolean) =>
  `Lamp ${l.n}, ${l.title}. ${lit ? "Lit." : "Not yet lit."}`;
