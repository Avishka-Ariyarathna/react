import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserModel from "../../model/userModel";
import "./register.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const SignUp = () => {
  const [formValues, setFormValues] = useState(new UserModel({ userType: "" }));
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formValues.username) errors.username = "Username is required";
    else if (!/^[A-Za-z0-9_]{3,15}$/.test(formValues.username))
      errors.username =
        "Username should be 3-15 characters long and can only contain letters, numbers, and underscores.";
    if (!formValues.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      errors.email = "Please enter a valid email address";
    if (!formValues.mobile) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formValues.mobile))
      errors.mobile = "Mobile number should be 10 digits";
    if (!formValues.password) errors.password = "Password is required";
    if (!formValues.userType) errors.userType = "User type is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/register-user`,
          formValues
        );
        if (response.data.success) {
          toast.success(response.data.message || "Registration successful!");
          setFormValues({
            username: "",
            email: "",
            mobile: "",
            password: "",
            userType: "",
          });
          setFormErrors({});
        } else {
          toast.error(response.data.message || "Registration failed!");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="register-wrapper">
      <div className="login-container">
        <div className="form-side">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formValues.username}
                onChange={handleInputChange}
              />
              {formErrors.username && (
                <span className="error-message">{formErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Mobile No</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formValues.mobile}
                onChange={handleInputChange}
              />
              {formErrors.mobile && (
                <span className="error-message">{formErrors.mobile}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleInputChange}
              />
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>User Type</label>
              <select
                name="userType"
                value={formValues.userType}
                onChange={handleInputChange}
              >
                <option value="">Select user type</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {formErrors.userType && (
                <span className="error-message">{formErrors.userType}</span>
              )}
            </div>

            <button type="submit" className="login-btn">
              Sign Up
            </button>
          </form>
        </div>
        <div className="image-side">
          {/* Image and decorative elements will be styled in SCSS */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
