import { useEffect, useState } from "react";
import api, { isTokenExpired } from "./plugins/axios";

function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (isTokenExpired(token)) {
            localStorage.clear();
        } else {
            if (onLoginSuccess) onLoginSuccess();
        }
    }, [onLoginSuccess]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email address cannot be left blank.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Email is not in the correct format.";
            }
        }

        if (!formData.password.trim()) {
            newErrors.password = "The password cannot be left blank.";
        } else if (formData.password.length < 6) {
            newErrors.password = "The password must be more than 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
        };

        try {
            const response = await api.post("/auth/signin", payload);
            setFormData({
                email: "",
                password: "",
            });
            setErrors({});

            const { accessToken, refreshToken } = response;

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            if (onLoginSuccess) onLoginSuccess();

            return accessToken;
        } catch (error) {
            console.error("Lỗi kết nối hoặc CORS:", error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-4 font-bold">Login</h1>
            <form className="flex flex-col gap-4 shadow-lg w-fit p-6 rounded-xl">
                <div>
                    <label htmlFor="email" className="font-bold">
                        Email:
                    </label>
                    <input
                        name="email"
                        id="email"
                        value={formData.email}
                        placeholder="Email..."
                        className="block border p-1 px-3 rounded-md mt-2"
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="font-bold">
                        Password:
                    </label>
                    <input
                        name="password"
                        id="password"
                        value={formData.password}
                        placeholder="Password..."
                        className="block border p-1 px-3 rounded-md mt-2"
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>
                <button
                    className="bg-[#ebebeb] hover:bg-[#888] rounded px-6 py-2 w-fit m-auto cursor-pointer"
                    onClick={handleSubmit}
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
