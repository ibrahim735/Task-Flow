import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { auth } from "../utils/firebase";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Button from "../components/common/Button";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [show, setShow] = useState(false);
  const toggleShow = () => {
    setShow(!show)
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password)
      console.log('user logged in successfully')
      window.location.href = "/dashboard"
    } catch (error) {
      console.log(error)
    }
  };

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      if (result.user) {
        window.location.href = "/dashboard"
      }
    })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[30%] h-fit shadow-lg flex flex-col items-center justify-center gap-5 p-10 rounded-lg"
      >
        <h1 className="text-3xl font-bold text-green-900">Task Flow</h1>
        <p className="font-semibold">Login to your account</p>

        <div className="w-full max-w-xs">
          <label htmlFor="email" className="block mb-2 font-semibold text-green-900">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your Email"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full max-w-xs">
          <label htmlFor="password" className="block mb-2 font-semibold text-green-900">
            Password
          </label>
          <div className="flex items-center justify-center relative">
            <input
              type={show ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter your password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-900 "
            />
            <span onClick={toggleShow} className="absolute right-5 cursor-pointer">{show ? <IoEye /> : <IoEyeOff />}</span>
          </div>

          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          className=" bg-green-900 text-white hover:bg-green-800 hover:brightness-110"
          text="Login"
          type="submit"
        />

        <p className="font-semibold">Or continue with: </p>

        <Button
          className="bg-white border border-solid border-[#D2D4D7] hover:bg-green-50 font-bold"
          onClick={googleLogin}
          icon={<FcGoogle className="text-3xl" />}
          text="Google"
          type="button"
        />

        <span>
          Don't have an account? <Link className="text-green-900 font-semibold" to="/signup">SignUp here.</Link>
        </span>
      </form>
    </div>
  );
}
