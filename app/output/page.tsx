// app/output/page.tsx

import CalculationPage from "../output/CalculationPage";
import { calculateFinalScore } from "../utils/gradeCalculator";

export default function OutputPage() {
  const grades = {
    nilaiTugas: [98],
    nilaiUts: 89,
    nilaiUas: 90,
  };

  const weights = {
    tugas: 0.3,
    uts: 0.3,
    uas: 0.4,
  };

  const result = calculateFinalScore(grades, weights);

  return (
    <CalculationPage
      grades={grades}
      weights={weights}
      result={result}
    />
  );
}