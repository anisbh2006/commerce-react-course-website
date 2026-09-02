import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext  } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Auth() {
    const [ mode, setMode ] = useState("signup");
    const[ error, setError ] = useState(null);
    const { signup, user, login } = useContext(AuthContext);
    const navigate = useNavigate();



    const { register,
        handleSubmit,
        formState: { errors } ,
    } = useForm();


    async function onSubmit(data) {
    setError(null);

    let result;

    if (mode === "signup") {
        result = await signup(data.email, data.password);
    } else {
        result = await login(data.email, data.password);
    }

    if (result.success) {
        navigate("/");
    } else {
        setError(result.message);
    }
}
    return (
    <div className="page">
        <div className="container">
            <div className="auth-container">
                {user && <p>user logged in : {user.email}</p>}
                <h1 className="page-title">{mode === "signup" ? "Sign Up" : "Login"}</h1>
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>

                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="email" id="email" placeholder="Enter your email" {...register("email", { required: "Email is required" })}
                        />
                        {errors. email &&(
                            <span className="form-message">{errors.email.message}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input  placeholder="Enter your password" {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long" ,
                                },
                                maxLength: {
                                    value: 12,
                                    message: "Password cannot exceed 12 characters" ,
                                },
                            })}
                            className="form-input"
                            type="password"
                            id="password"
                        />
                        {errors.password && (
                            <span className="form-message">{errors.password.message}</span>
                        )}
                    </div>

                    <button className="btn btn-primary btn-large" type="submit">{mode === "signup" ? "Sign Up" : "Login"}</button>
                </form>

                <div className="auth-switch">
                    {mode === "signup" ? (
                        <p>
                            Already have an account? {""}
                            <button className="auth-link" type="button" onClick={() => setMode("login")}>Login</button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account? {""}
                            <button className="auth-link" type="button" onClick={() => setMode("signup")}>Sign Up</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}
