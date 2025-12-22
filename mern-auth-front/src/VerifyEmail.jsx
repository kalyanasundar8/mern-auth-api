import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  console.log(token);

  useEffect(() => {
    if (!token) {
      console.log("Invalid verification link!");
    } else {
      verifyToken(token);
    }

    // Verify token using API
    async function verifyToken(token) {
      try {
        const response = await fetch(
          `http://localhost:4003/api/user/verify-email?token=${token}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        console.log(data)

        if (response.ok) {
          status.innerText = "Email verified successfully";
        } else {
          status.innerText = data.message || "Verification failed";
        }
      } catch (error) {
        status.innerText = "Something went wrong!, please try again";
        console.log(`Email verification error: ${error}`);
      }
    }
  }, []);
  return <div>VerifyEmail</div>;
};

export default VerifyEmail;
