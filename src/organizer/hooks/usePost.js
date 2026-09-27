import { useEffect, useState } from "react";

export const usePost = (route, raw) => {
  const [ status, setStatus] = useState(null);
  const [ data, setData ] = useState();

  useEffect(() => {
    const getdata = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/${route}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body:JSON.stringify(raw)
          }
        );

        const data = await res.json();
        console.log(data);
        setData(data);
        setStatus(res.status);
      } catch (err) {
        console.error(err);
      }
    };

    getdata();
  }, []);

  return {status, data };
};