import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { auth, db } from "../utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface FormData {
  name: string,
  email: string,
  password: string,
}

export default function SignUp() {
  const { register, handleSubmit, formState: {
    errors, isSubmitting,
  } } = useForm<FormData>();

  const [show, setShow] = useState(false);
  const toggleShow = () => {
    setShow(!show)
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { email, password, name } = data; // Include name
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: name, // Use the name from form data
        });
      }
      console.log('User registered successfully');
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      if (result.user) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName // Use the name from form data
        });
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
        <p className="font-semibold">Create your account</p>

        <div className="w-full max-w-xs">
          <label htmlFor="name" className="block mb-2 font-semibold text-green-900">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your Name"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          {errors.name && (
            <p className="text-red-600">{errors.name.message}</p>
          )}
        </div>

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
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-900"
            />
            <span onClick={toggleShow} className="absolute right-5 cursor-pointer">{show ? <IoEye /> : <IoEyeOff />}</span>
          </div>
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="btn w-full text-white bg-green-900 hover:bg-green-800 hover:brightness-110 "
        >
          Create account
        </button>


        <p className="font-semibold">Or continue with: </p>

        <button
          type="button"
          onClick={googleLogin}
          className="btn w-full bg-transparent border border-solid border-[#D2D4D7] hover:bg-green-50 font-bold"
        >
          <FcGoogle className="text-3xl" />
          Google
        </button>

        <span>
          Already have an account? <Link className="text-green-900 font-semibold" to="/">Login here.</Link>
        </span>
      </form>
    </div>
  )
}
