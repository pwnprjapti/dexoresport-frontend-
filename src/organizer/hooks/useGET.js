import { useEffect, useState } from "react";

export const useGET = (route) => {
  const [ status, setStatus] = useState(null);
  const [ data, setData ] = useState();

  useEffect(() => {
    const getdata = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/${route}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
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