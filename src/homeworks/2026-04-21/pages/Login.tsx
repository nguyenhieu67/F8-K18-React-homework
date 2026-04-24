import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import {
    Container,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useNavigate } from "react-router-dom";
import { fetchApi } from "../../../utils/api";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

interface UserInfo {
    email: string;
    password: string;
}

function Login() {
    const loginForm = {
        email: "",
        password: "",
    };

    const [formData, setFormData] = useState<UserInfo>(loginForm);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {},
    );
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/homework_44/orders");
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "email") {
            setErrors((prev) => ({ ...prev, email: "" }));
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
        };

        try {
            const response = (await fetchApi.post(
                "/auth/signin",
                payload,
            )) as unknown as AuthResponse;
            setFormData(loginForm);
            setErrors({});

            const { accessToken, refreshToken } = response;

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            toast.success("Login successful");
            navigate("/homework_44/orders");
            return accessToken;
        } catch (error) {
            console.error("Lỗi kết nối hoặc CORS:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>

                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            autoFocus
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label="Remember me"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>

                        <Grid container>
                            <Grid size={12}>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid size={12}>
                                <Link href="#" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

//

export default Login;
