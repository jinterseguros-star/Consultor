function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard ✅</h2>

      <p>Usuario: {user?.usuario}</p>
      <p>Estado: {user?.estado}</p>

      {user?.estado === 2 && (
        <p style={{ color: "green" }}>Eres ADMIN</p>
      )}
    </div>
  );
}

export default Dashboard;