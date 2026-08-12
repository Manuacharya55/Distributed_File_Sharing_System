import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/schema";
import RegisterForm from "../components/RegisterForm";
import { postRequest } from "../../../api/api";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterUser = async (data) => {
    console.log(data)
    const response = await postRequest("/register", data);
    console.log(response);
  };

  return (
    <div className="w-full h-screen bg-white flex">
      <div className="w-3/4 h-screen p-4">
        <img src="background.png" alt="" className="w-full h-full rounded-md"/>
      </div>
      <div className="w-1/2 h-screen p-8 flex flex-col justify-center">
        <h1 className="text-6xl text-center font-bold mb-6">Register Here</h1>
        <RegisterForm
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={handleRegisterUser}
        />
        <span className="mt-2">already have account ? <Link to="/login">login here</Link></span>
      </div>
    </div>
  );
};

export default RegisterPage;
