import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
      <h1 
        onClick={() => navigate("/")}
        className="text-xl font-semibold tracking-wide cursor-pointer"
      >
        Dataroom <span className="text-blue-600">Lite</span>
      </h1>
      {user ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Login
        </button>
      )}
    </header>
  );
}
