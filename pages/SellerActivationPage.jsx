import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import { useDispatch } from "react-redux";
import { loadSeller } from "../redux/actions/user";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log(res);
          // Reload seller data and redirect after a short delay
          setTimeout(() => {
            dispatch(loadSeller());
            navigate("/dashboard");
          }, 2000);
        } catch (err) {
          console.log(err);
          setError(true);
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token, navigate, dispatch]);

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
        <div className="text-center">
          <p style={{ fontSize: "18px", color: "#e74c3c" }}>Your token is expired!</p>
          <p style={{ fontSize: "14px", color: "#7f8c8d", marginTop: "10px" }}>
            Please try signing up again.
          </p>
        </div>
      ) : loading ? (
        <div className="text-center">
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>Your account has been created successfully!</p>
          <p style={{ fontSize: "14px", color: "#7f8c8d" }}>Redirecting to dashboard...</p>
        </div>
      ) : null}
    </div>
  );
};

export default SellerActivationPage;
