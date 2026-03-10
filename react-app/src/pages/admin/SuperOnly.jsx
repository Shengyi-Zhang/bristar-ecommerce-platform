import { useOutletContext, Navigate } from "react-router-dom";

export default function SuperOnly({ children }) {
  const { admin } = useOutletContext();

  if (admin?.role !== "super") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
