// pages/CalculationPage.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CalculationResult, GradingWeights, StudentGrades } from "../types/evaluation";

interface Props {
  grades: StudentGrades;
  weights: GradingWeights;
  result: CalculationResult;
  onViewOutput?: () => void;
}

const GRADE_STANDARDS = [
  { letter: "A",  min: 85, max: 100 },
  { letter: "B+", min: 80, max: 84 },
  { letter: "B",  min: 75, max: 79 },
  { letter: "C+", min: 70, max: 74 },
  { letter: "C",  min: 61, max: 69 },
  { letter: "D",  min: 50, max: 60 },
  { letter: "E",  min: 0,  max: 49 },
];

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A:   { bg: "#C0DD97", text: "#27500A" },
  "B+":{ bg: "#9FE1CB", text: "#085041" },
  B:   { bg: "#9FE1CB", text: "#085041" },
  "C+":{ bg: "#FAC775", text: "#633806" },
  C:   { bg: "#FAC775", text: "#633806" },
  D:   { bg: "#F5C4B3", text: "#4A1B0C" },
  E:   { bg: "#F7C1C1", text: "#501313" },
};

export default function CalculationPage({ grades, weights, result, onViewOutput }: Props) {
  const router = useRouter();
  const { rataRataTugas, nilaiAkhir, nilaiHuruf } = result;

  const tugasContrib = (weights.tugas * rataRataTugas).toFixed(2);
  const utsContrib   = (weights.uts   * grades.nilaiUts).toFixed(2);
  const uasContrib   = (weights.uas   * grades.nilaiUas).toFixed(2);

  const gradeColor = GRADE_COLORS[nilaiHuruf] ?? { bg: "#D3D1C7", text: "#444441" };

  return (
    <div style={{ padding: "1.5rem", background: "#F3F4F6", minHeight: "100vh" }}>

      {/* Heading */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>
          Proses Perhitungan
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
          Breakdown perhitungan nilai akhir berdasarkan bobot
        </p>
      </div>

      {/* Card 1: Rata-rata Tugas */}
      <Card>
        <CardHeader badge="1" badgeColor="#CECBF6" badgeText="#3C3489">
          Rata-rata Nilai Tugas
        </CardHeader>

        {grades.nilaiTugas.map((val, i) => (
          <Row key={i} label={`Tugas ${i + 1}`} value={val.toFixed(2)} />
        ))}

        <Row
          label="Rata-rata"
          value={rataRataTugas.toFixed(2)}
          labelBold
          valueColor="#534AB7"
          valueLarge
        />
      </Card>

      {/* Card 2: Nilai Berbobot */}
      <Card>
        <CardHeader badge="2" badgeColor="#CECBF6" badgeText="#3C3489">
          Nilai Akhir Berdasarkan Bobot
        </CardHeader>

        <FormulaRow
          label={`Tugas (${weights.tugas * 100}%)`}
          formula={`${rataRataTugas.toFixed(2)} × ${weights.tugas * 100}% =`}
          contrib={tugasContrib}
        />
        <FormulaRow
          label={`UTS (${weights.uts * 100}%)`}
          formula={`${grades.nilaiUts.toFixed(2)} × ${weights.uts * 100}% =`}
          contrib={utsContrib}
        />
        <FormulaRow
          label={`UAS (${weights.uas * 100}%)`}
          formula={`${grades.nilaiUas.toFixed(2)} × ${weights.uas * 100}% =`}
          contrib={uasContrib}
        />

        <Row
          label="Nilai Akhir"
          value={nilaiAkhir.toFixed(2)}
          labelBold
          valueColor="#534AB7"
          valueLarge
        />
      </Card>

      {/* Card 3: Konversi Huruf */}
      <Card>
        <CardHeader badge="3" badgeColor="#9FE1CB" badgeText="#085041">
          Konversi Nilai Huruf
        </CardHeader>

        {/* Score + Letter badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: "#6B7280" }}>Nilai Angka</p>
            <p style={{ fontSize: 28, fontWeight: 500, color: "#111" }}>
              {nilaiAkhir.toFixed(2)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "#6B7280" }}>Nilai Huruf</p>
            <div
              style={{
                width: 44, height: 44,
                borderRadius: 8,
                background: gradeColor.bg,
                color: gradeColor.text,
                fontSize: 20, fontWeight: 500,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {nilaiHuruf}
            </div>
          </div>
        </div>

        {/* Standar Konversi */}
        <div style={{ borderTop: "0.5px solid #E5E7EB", paddingTop: 10 }}>
          <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>Standar Konversi</p>
          <div style={{ display: "flex", gap: 6 }}>
            {GRADE_STANDARDS.map((s) => {
              const active = s.letter === nilaiHuruf;
              return (
                <div
                  key={s.letter}
                  style={{
                    flex: 1, padding: "5px 6px", borderRadius: 6, textAlign: "center",
                    background: active ? gradeColor.bg : "#F3F4F6",
                    color: active ? gradeColor.text : "#9CA3AF",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 500 }}>{s.letter}</div>
                  <div style={{ fontSize: 10, marginTop: 1 }}>
                    {s.min}–{s.max}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* CTA Button */}
      <button
        onClick={() => router.push('/view-output')}
        style={{
          width: "100%", padding: "0.75rem",
          borderRadius: 12, border: "none",
          background: "#1D9E75", color: "#fff",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          marginTop: 4,
        }}
      >
        Lihat Output &amp; Export Data
      </button>

      <button
          onClick={() => router.push('/input')}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: 12,
            border: "none",
            background: "#DC2626",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Input Data Baru
        </button>
    </div>
  );
}

/* ─── Sub-components ─── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  badge, badgeColor, badgeText, children,
}: {
  badge: string; badgeColor: string; badgeText: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div
        style={{
          width: 22, height: 22, borderRadius: "50%",
          background: badgeColor, color: badgeText,
          fontSize: 11, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {badge}
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{children}</span>
    </div>
  );
}

function Row({
  label, value, labelBold, valueColor, valueLarge,
}: {
  label: string; value: string;
  labelBold?: boolean; valueColor?: string; valueLarge?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.45rem 0",
        borderTop: "0.5px solid #E5E7EB",
      }}
    >
      <span style={{ fontSize: 13, color: labelBold ? "#111" : "#6B7280", fontWeight: labelBold ? 500 : 400 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: valueLarge ? 15 : 13,
          fontWeight: 500,
          color: valueColor ?? "#111",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function FormulaRow({ label, formula, contrib }: { label: string; formula: string; contrib: string }) {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.45rem 0",
        borderTop: "0.5px solid #E5E7EB",
      }}
    >
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#9CA3AF" }}>
        {formula}{" "}
        <span style={{ color: "#D85A30", fontWeight: 500 }}>{contrib}</span>
      </span>
    </div>
  );
}

