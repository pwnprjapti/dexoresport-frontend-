import { useContext } from "react";
import { AdminAuthContext } from "./AdminContextCore";

export const useAdminAuth = () => useContext(AdminAuthContext);
