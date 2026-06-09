import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setError(true);
          setErrorMessage(err.response?.data?.message || "Token is expired. Please sign up again.");
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {error ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#e74c3c" }}>{errorMessage}</p>
          <p style={{ fontSize: "14px", color: "#7f8c8d", marginTop: "10px" }}>
            Please try signing up again.
          </p>
        </div>
      ) : loading ? (
        <p>Activating your account...</p>
      ) : (
        <p>Your account has been created successfully!</p>
      )}
    </div>
  );
};

export default ActivationPage;
