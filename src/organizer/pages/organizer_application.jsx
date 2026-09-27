import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../compo/Loading.jsx";

export default function Application(){
    const navigate = useNavigate();

    useEffect(() => {
        // Direct organizer accounts are enabled - no application required!
        navigate("/organizer/dashboard", { replace: true });
    }, [navigate]);

    return <Loading />;
}