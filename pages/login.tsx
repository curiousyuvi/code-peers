import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { validateCallback } from "@firebase/util";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticProps, NextPage } from "next/types";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../components/AuthLayout";
import LoggedIn from "../components/LoggedIn";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";

const Login: NextPage = () => {
  const router = useRouter();
  const { signIn, authenticateWithGithub, authenticateWithGoogle } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event: any) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const [isFormError, setIsFormError] = useState<boolean>(false);
  const validateForm = () => {
    setIsFormError(false);
    setFormError({ email: "", password: "" });

    var validEmailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!formData.email.trim().match(validEmailRegex)) {
      setFormError({ password: "", email: "Not a valid email" });
      return false;
    }

    if (formData.password.trim().length < 8) {
      setFormError({
        email: "",
        password: "Password is too short, must be atleast 8 charachters",
      });
      return false;
    }

    setIsFormError(false);
    setFormError({ email: "", password: "" });

    return true;
  };

  const handleGithubAuthClick = async () => {
    setLoading(true);
    await authenticateWithGithub();
    setLoading(false);
  };

  const handleGoogleAuthClick = async () => {
    setLoading(true);
    await authenticateWithGoogle();
    setLoading(false);
  };

  const handleEmailPasswordFormSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await signIn(formData.email.trim(), formData.password.trim());
      setLoading(false);
    } else {
      setIsFormError(true);
    }
  };

  const borderFocusColor = useColorModeValue("green.300", "green.500");
  const redButtonColor = useColorModeValue("red.400", "red.600");
  const bwButtonColor = useColorModeValue("black", "white");

  if (auth.currentUser) return <LoggedIn />;

  return (
    <AuthLayout>
      <Box className="w-full h-full p-4 flex flex-col justify-center items-center">
        <Image
          src="/logo.svg"
          alt="Compifly"
          height={75}
          width={75}
          className="rounded-full"
        />
        <span className="my-1" />
        <p>Welcome back to Compifly</p>
        <span className="my-2" />
        <Heading>Login</Heading>
        <FormControl isInvalid={isFormError}>
          <form
            onSubmit={handleEmailPasswordFormSubmit}
            className="w-full flex flex-col justify-center items-center"
          >
            <span className="my-4" />
            <Input
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full max-w-sm"
              height="14"
              fontSize="xl"
              focusBorderColor={borderFocusColor}
              size="lg"
            />
            <FormErrorMessage>{formError.email}</FormErrorMessage>
            <span className="my-2" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full max-w-sm"
              height="14"
              fontSize="xl"
              focusBorderColor={borderFocusColor}
              size="lg"
            />
            <FormErrorMessage>{formError.password}</FormErrorMessage>
            <span className="my-3" />
            <Button
              className="w-full max-w-sm p-2"
              height="14"
              bgColor={borderFocusColor}
              type="submit"
            >
              <Text fontWeight="extrabold" fontSize="xl">
                {loading ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.400"
                    color={"white"}
                    size="md"
                  />
                ) : (
                  "LOGIN"
                )}
              </Text>
            </Button>
            <span className="my-2" />
          </form>
        </FormControl>
        <p>or</p>
        <span className="my-2" />
        <Button
          className="w-full max-w-sm"
          height="14"
          variant="outline"
          borderColor={redButtonColor}
          onClick={handleGoogleAuthClick}
        >
          <Text
            fontWeight="extrabold"
            fontSize="xl"
            className="flex items-center"
            color={redButtonColor}
          >
            <FcGoogle className="text-2xl" />
            <span className="mx-2" />
            {"Continue with Google"}
          </Text>
        </Button>
        <span className="my-3" />
        <Button
          className="w-full max-w-sm"
          height="14"
          variant="outline"
          borderColor={bwButtonColor}
          color={bwButtonColor}
          onClick={handleGithubAuthClick}
        >
          <Text
            fontWeight="extrabold"
            fontSize="xl"
            className="flex items-center"
          >
            <FaGithub className="text-2xl" />
            <span className="mx-2" />
            {"Continue with GitHub"}
          </Text>
        </Button>
        <span className="my-4" />
        <Text>
          New user?
          <span className="ml-1" />
          <Link href="/register">
            <Button variant="link">Register</Button>
          </Link>
        </Text>
        <span className="my-1" />
        <Link href="/forgot_password">
          <Button variant="link">Forgot password?</Button>
        </Link>
      </Box>
    </AuthLayout>
  );
};

export default Login;
