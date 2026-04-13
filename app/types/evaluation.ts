// types/evaluation.ts

export interface GradingWeights {
  tugas: number; // Contoh: 0.2 untuk 20%
  uts: number; // Contoh: 0.3 untuk 30%
  uas: number; // Contoh: 0.5 untuk 50%
}

export interface StudentGrades {
  nilaiTugas: number[]; // Mendukung jumlah tugas bervariasi [cite: 213, 278]
  nilaiUts: number;
  nilaiUas: number;
}

export interface CalculationResult {
  rataRataTugas: number;
  nilaiAkhir: number;
  nilaiHuruf: string;
}
