// utils/gradeCalculator.ts

import {
  GradingWeights,
  StudentGrades,
  CalculationResult,
} from "../types/evaluation";

/**
 * Mengonversi nilai akhir numerik menjadi nilai huruf berdasarkan rentang standar [cite: 217, 302-309]
 */
export const convertToLettergrade = (score: number): string => {
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 61) return "C";
  if (score >= 50) return "D";
  return "E";
};

/**
 * Menghitung nilai akhir berdasarkan bobot dan input nilai [cite: 208, 214]
 */
export const calculateFinalScore = (
  grades: StudentGrades,
  weights: GradingWeights,
): CalculationResult => {
  // 1. Hitung rata-rata nilai tugas [cite: 207, 213]
  const totalTugas = grades.nilaiTugas.reduce((acc, curr) => acc + curr, 0);
  const rataRataTugas =
    grades.nilaiTugas.length > 0 ? totalTugas / grades.nilaiTugas.length : 0;

  // 2. Hitung nilai akhir sesuai formula [cite: 208, 300]
  // Formula: (Bobot Tugas × Rata-rata Tugas) + (Bobot UTS × Nilai UTS) + (Bobot UAS × Nilai UAS)
  let nilaiAkhir =
    weights.tugas * rataRataTugas +
    weights.uts * grades.nilaiUts +
    weights.uas * grades.nilaiUas;

  // 3. Batasi nilai maksimal 100 [cite: 209, 215, 301]
  if (nilaiAkhir > 100) {
    nilaiAkhir = 100;
  }

  // 4. Konversi ke nilai huruf [cite: 210, 216]
  const nilaiHuruf = convertToLettergrade(nilaiAkhir);

  return {
    rataRataTugas: Number(rataRataTugas.toFixed(2)),
    nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
    nilaiHuruf,
  };
};
