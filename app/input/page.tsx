"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const router = useRouter();

  const [nilaiTugas, setNilaiTugas] = useState<string[]>([""]);
  const [nilaiUts, setNilaiUts] = useState("");
  const [nilaiUas, setNilaiUas] = useState("");
  const [bobotTugas, setBobotTugas] = useState("30");
  const [bobotUts, setBobotUts] = useState("30");
  const [bobotUas, setBobotUas] = useState("40");
  const [error, setError] = useState("");

  const handleTugasChange = (index: number, value: string) => {
    const updated = [...nilaiTugas];
    updated[index] = value;
    setNilaiTugas(updated);
  };

  const tambahTugas = () => {
    setNilaiTugas([...nilaiTugas, ""]);
  };

  const hapusTugas = (index: number) => {
    if (nilaiTugas.length === 1) return;
    const updated = nilaiTugas.filter((_, i) => i !== index);
    setNilaiTugas(updated);
  };

  const handleSubmit = () => {
    setError("");

    if (
      nilaiTugas.some((item) => item.trim() === "") ||
      nilaiUts.trim() === "" ||
      nilaiUas.trim() === "" ||
      bobotTugas.trim() === "" ||
      bobotUts.trim() === "" ||
      bobotUas.trim() === ""
    ) {
      setError("Semua input harus diisi.");
      return;
    }

    const tugasNumbers = nilaiTugas.map(Number);
    const utsNumber = Number(nilaiUts);
    const uasNumber = Number(nilaiUas);
    const bt = Number(bobotTugas);
    const bu = Number(bobotUts);
    const ba = Number(bobotUas);

    if (
      tugasNumbers.some((n) => isNaN(n)) ||
      isNaN(utsNumber) ||
      isNaN(uasNumber) ||
      isNaN(bt) ||
      isNaN(bu) ||
      isNaN(ba)
    ) {
      setError("Semua input harus berupa angka.");
      return;
    }

    if (
      tugasNumbers.some((n) => n < 0 || n > 100) ||
      utsNumber < 0 || utsNumber > 100 ||
      uasNumber < 0 || uasNumber > 100
    ) {
      setError("Nilai hanya boleh dari 0 sampai 100.");
      return;
    }

    if (bt + bu + ba !== 100) {
      setError("Total bobot harus 100%.");
      return;
    }

    const data = {
      grades: {
        nilaiTugas: tugasNumbers,
        nilaiUts: utsNumber,
        nilaiUas: uasNumber,
      },
      weights: {
        tugas: bt / 100,
        uts: bu / 100,
        uas: ba / 100,
      },
    };

    localStorage.setItem("gradingData", JSON.stringify(data));
    router.push("/view-output");
  };

  return (
    <div style={{ padding: "1.5rem", background: "#F3F4F6", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          padding: "1.5rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>
            Input Nilai Mahasiswa
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            Masukkan nilai tugas, UTS, UAS, dan bobot penilaian
          </p>
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
          <p style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 12 }}>
            Nilai Tugas
          </p>

          {nilaiTugas.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: 10, marginBottom: 10 }}
            >
              <input
                type="number"
                value={item}
                onChange={(e) => handleTugasChange(index, e.target.value)}
                placeholder={`Nilai Tugas ${index + 1}`}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => hapusTugas(index)}
                style={dangerButtonStyle}
              >
                Hapus
              </button>
            </div>
          ))}

          <button type="button" onClick={tambahTugas} style={secondaryButtonStyle}>
            + Tambah Tugas
          </button>
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
          <p style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 12 }}>
            Nilai Ujian
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input
              type="number"
              value={nilaiUts}
              onChange={(e) => setNilaiUts(e.target.value)}
              placeholder="Nilai UTS"
              style={inputStyle}
            />
            <input
              type="number"
              value={nilaiUas}
              onChange={(e) => setNilaiUas(e.target.value)}
              placeholder="Nilai UAS"
              style={inputStyle}
            />
          </div>
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
          <p style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 12 }}>
            Bobot Penilaian (%)
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <input
              type="number"
              value={bobotTugas}
              onChange={(e) => setBobotTugas(e.target.value)}
              placeholder="Bobot Tugas"
              style={inputStyle}
            />
            <input
              type="number"
              value={bobotUts}
              onChange={(e) => setBobotUts(e.target.value)}
              placeholder="Bobot UTS"
              style={inputStyle}
            />
            <input
              type="number"
              value={bobotUas}
              onChange={(e) => setBobotUas(e.target.value)}
              placeholder="Bobot UAS"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: 10,
              background: "#FEE2E2",
              color: "#991B1B",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => router.push("/output")}
            style={backButtonStyle}
          >
            ← Kembali
          </button>

          <button
            onClick={handleSubmit}
            style={primaryButtonStyle}
          >
            Hitung Nilai
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "0.5px solid #D1D5DB",
  fontSize: 14,
  color: "#111",
};

const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: 10,
  border: "none",
  background: "#1D9E75",
  color: "#fff",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const backButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: 10,
  border: "0.5px solid #E5E7EB",
  background: "#fff",
  color: "#374151",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "0.65rem 1rem",
  borderRadius: 10,
  border: "none",
  background: "#E5E7EB",
  color: "#111827",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "0.65rem 1rem",
  borderRadius: 10,
  border: "none",
  background: "#FEE2E2",
  color: "#991B1B",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};