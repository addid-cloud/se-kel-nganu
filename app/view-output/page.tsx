"use client";

import { useEffect, useState } from "react";
import { calculateFinalScore } from "../utils/gradeCalculator";

type Grades = {
  nilaiTugas: number[];
  nilaiUts: number;
  nilaiUas: number;
};

type Weights = {
  tugas: number;
  uts: number;
  uas: number;
};

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: "#7C3AED", text: "#ffffff" },
  "B+": { bg: "#9FE1CB", text: "#085041" },
  B: { bg: "#9FE1CB", text: "#085041" },
  "C+": { bg: "#FAC775", text: "#633806" },
  C: { bg: "#FAC775", text: "#633806" },
  D: { bg: "#F5C4B3", text: "#4A1B0C" },
  E: { bg: "#F7C1C1", text: "#501313" },
};

export default function OutputPage() {
  const [grades, setGrades] = useState<Grades | null>(null);
  const [weights, setWeights] = useState<Weights | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("gradingData");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setGrades(parsed.grades);
      setWeights(parsed.weights);
    }
  }, []);

  if (!grades || !weights) {
    return (
      <div style={{ padding: "1.5rem", background: "#F3F4F6", minHeight: "100vh" }}>
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #E5E7EB",
            borderRadius: 12,
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#111", marginBottom: 8 }}>
            Data belum tersedia
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
            Silakan isi data nilai terlebih dahulu.
          </p>
          <button
            onClick={() => (window.location.href = "/input")}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: "none",
              background: "#1D9E75",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Ke Halaman Input
          </button>
        </div>
      </div>
    );
  }

  const result = calculateFinalScore(grades, weights);
  const { rataRataTugas, nilaiAkhir, nilaiHuruf } = result;

  const tugasContrib = (weights.tugas * rataRataTugas).toFixed(2);
  const utsContrib = (weights.uts * grades.nilaiUts).toFixed(2);
  const uasContrib = (weights.uas * grades.nilaiUas).toFixed(2);

  const gradeColor = GRADE_COLORS[nilaiHuruf] ?? { bg: "#D3D1C7", text: "#444441" };

  const handleExportCSV = () => {
    const rows = [
      ["Komponen", "Nilai", "Bobot (%)", "Kontribusi"],
      ["Rata-rata Tugas", rataRataTugas.toFixed(2), `${weights.tugas * 100}%`, tugasContrib],
      ["UTS", grades.nilaiUts.toFixed(2), `${weights.uts * 100}%`, utsContrib],
      ["UAS", grades.nilaiUas.toFixed(2), `${weights.uas * 100}%`, uasContrib],
      ["Nilai Akhir", "", "", nilaiAkhir.toFixed(2)],
      ["Nilai Huruf", "", "", nilaiHuruf],
    ];

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hasil_nilai.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      input: {
        nilaiTugas: grades.nilaiTugas,
        nilaiUts: grades.nilaiUts,
        nilaiUas: grades.nilaiUas,
        bobot: {
          tugas: `${weights.tugas * 100}%`,
          uts: `${weights.uts * 100}%`,
          uas: `${weights.uas * 100}%`,
        },
      },
      hasil: {
        rataRataTugas,
        kontribusi: {
          tugas: parseFloat(tugasContrib),
          uts: parseFloat(utsContrib),
          uas: parseFloat(uasContrib),
        },
        nilaiAkhir,
        nilaiHuruf,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hasil_nilai.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "1.5rem", background: "#F3F4F6", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>
          Data Akhir
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
          Ringkasan lengkap perhitungan nilai dalam format tabel
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Komponen", "Nilai", "Bobot (%)", "Kontribusi"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: h === "Komponen" ? "left" : "right",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#6B7280",
                    borderBottom: "0.5px solid #E5E7EB",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TableRow
              label="Rata-rata Tugas"
              nilai={rataRataTugas.toFixed(2)}
              bobot={`${weights.tugas * 100}%`}
              kontribusi={tugasContrib}
            />
            <TableRow
              label="UTS"
              nilai={grades.nilaiUts.toFixed(2)}
              bobot={`${weights.uts * 100}%`}
              kontribusi={utsContrib}
            />
            <TableRow
              label="UAS"
              nilai={grades.nilaiUas.toFixed(2)}
              bobot={`${weights.uas * 100}%`}
              kontribusi={uasContrib}
            />

            <tr style={{ background: "#F9FAFB" }}>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#111",
                  borderTop: "0.5px solid #E5E7EB",
                }}
              >
                Nilai Akhir
              </td>
              <td colSpan={2} />
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#534AB7",
                  borderTop: "0.5px solid #E5E7EB",
                }}
              >
                {nilaiAkhir.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#111",
                  borderTop: "0.5px solid #E5E7EB",
                }}
              >
                Nilai Huruf
              </td>
              <td colSpan={2} style={{ borderTop: "0.5px solid #E5E7EB" }} />
              <td
                style={{
                  padding: "10px 16px",
                  textAlign: "right",
                  borderTop: "0.5px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: gradeColor.bg,
                      color: gradeColor.text,
                      fontSize: 16,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {nilaiHuruf}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: "#111", marginBottom: 10 }}>
          Detail Nilai Tugas
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {grades.nilaiTugas.map((val, i) => (
            <div
              key={i}
              style={{
                background: "#F3F4F6",
                borderRadius: 8,
                padding: "8px 16px",
                minWidth: 80,
              }}
            >
              <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
                Tugas {i + 1}
              </p>
              <p style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>
                {val.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button
          onClick={handleExportCSV}
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: 10,
            border: "none",
            background: "#16A34A",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <FileIcon /> Export CSV
        </button>
        <button
          onClick={handleExportJSON}
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: 10,
            border: "none",
            background: "#C026D3",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <FileIcon /> Export JSON
        </button>
      </div>

      <button
        onClick={() => window.history.back()}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: 10,
          border: "0.5px solid #E5E7EB",
          background: "#fff",
          color: "#374151",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        ← Input Data Baru
      </button>
    </div>
  );
}

function TableRow({
  label,
  nilai,
  bobot,
  kontribusi,
}: {
  label: string;
  nilai: string;
  bobot: string;
  kontribusi: string;
}) {
  return (
    <tr>
      <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151", borderTop: "0.5px solid #E5E7EB" }}>
        {label}
      </td>
      <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151", textAlign: "right", borderTop: "0.5px solid #E5E7EB" }}>
        {nilai}
      </td>
      <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151", textAlign: "right", borderTop: "0.5px solid #E5E7EB" }}>
        {bobot}
      </td>
      <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151", textAlign: "right", borderTop: "0.5px solid #E5E7EB" }}>
        {kontribusi}
      </td>
    </tr>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}