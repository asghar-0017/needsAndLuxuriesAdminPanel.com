import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/styles/mainScreen.css";
import { postData } from "../../config/apiServices/apiServices";
import LoadingBar from "react-top-loading-bar";
import { showSuccessToast } from "../../components/toast/toast";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Watch the password and confirm password
  const password = watch("password");
  const confirmPassword = watch(
    "confirmPassword"
  );

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setProgress(50);

    try {
      const res = await postData(
        "reset-password",
        {
          newPassword: data.password,
        }
      );

      console.log(res);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password updated successfully!",
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update the password. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="mainForm">
      <LoadingBar
        color="#4599B4"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="form-container">
        <div className="logo-container">
          Change Password
        </div>

        <form
          className="form"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="error-message">
                {errors.password.message}
              </p>
            )}

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required:
                  "Please confirm your password",
                validate: {
                  matchesPreviousPassword: (
                    value
                  ) => {
                    const match =
                      value === password;
                    return (
                      match ||
                      "Passwords do not match!"
                    );
                  },
                },
              })}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="error-message">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            className="form-submit-btn"
            type="submit"
            disabled={loading}>
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>

        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
