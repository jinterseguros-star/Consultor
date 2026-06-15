import { useState } from "react";
import api from "../api/client";

function Polizas() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscar = async () => {
    try {
      const res = await api.get(`/polizas/buscar?texto=${texto}`);
      setResultados(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Error al buscar pólizas");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Buscar Pólizas 🔍</h2>

      {/* BUSCADOR */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          placeholder="Buscar..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            marginRight: "10px",
            width: "250px",
          }}
        />

        <button
          onClick={buscar}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {/* RESULTADOS */}
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        {resultados.map((p, index) => (
          <div
  key={index}
  style={{
    background: "#1e1e2f",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
    transition: "transform 0.2s",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "scale(1.02)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>

  {/* ✅ SOLO ESTE CENTRADO */}
  <h3
    style={{
      textAlign: "center",
      color: "#4CAF50",
      marginBottom: "15px",
    }}
  >
    {p.Compañia}
  </h3>

  {/* ✅ TODO ESTO A LA IZQUIERDA */}
  <div style={{ textAlign: "left" }}>
    <p><strong>Cliente:</strong> {p.nombre} {p.apellido}</p>
    <p><strong>DNI:</strong> {p.dni}</p>
    <p><strong>Póliza:</strong> {p.NroPoliza}</p>
    <p><strong>Cobertura:</strong> {p.Cobertura}</p>
    <p><strong>Origen:</strong> {p.Origen}</p>

    <p style={{ marginTop: "10px" }}>
      <strong>Objeto:</strong>
    </p>

    <p style={{ fontSize: "14px", opacity: 0.8 }}>
      {p.ObjetoAsegurado}
    </p>

    <p style={{ marginTop: "10px" }}>
      <strong>Descripción:</strong>
    </p>

    <p style={{ fontSize: "14px", opacity: 0.8 }}>
      {p.descripcionPoliza}
    </p>
  </div>
</div>
        ))}
      </div>
    </div>
  );
}

export default Polizas;
