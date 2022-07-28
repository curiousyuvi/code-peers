import { Avatar, Heading, Stack, Text } from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Badges from "../components/Badges";
import Layout from "../components/Layout";
import LoadingLayout from "../components/LoadingLayout";
import { auth } from "../firebase";
import useDB from "../hooks/useDB";
import { UserDoc } from "../interfaces/UserDoc";

const Home: NextPage = () => {
  const router = useRouter();
  const { userDocExists, getUserDoc } = useDB();
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [userDoc, setUserDoc] = useState<UserDoc | null>();

  useEffect(() => {
    const loadUserData = async (uid: string) => {
      setUserDoc(await getUserDoc(uid));
    };

    const checkUser = async () => {
      setAuthLoading(true);
      if (auth.currentUser?.uid) {
        if (!(await userDocExists(auth.currentUser.uid)))
          router.replace("/create_user");
        else loadUserData(auth.currentUser.uid);
      } else router.replace("/login");
      setAuthLoading(false);
    };

    auth.onAuthStateChanged(() => {
      checkUser();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  if (authLoading) return <LoadingLayout />;

  return (
    <Layout>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Head>
          <title>Complify</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-56 w-56 sm:h-72 sm:w-72 flex justify-center items-center relative">
          <Player
            autoplay={true}
            loop={true}
            src="/circle-wave-lottie.json"
            speed={0.4}
            style={{
              height: "100%",
              width: "100%",
              top: "0",
              left: "0",
              position: "absolute",
              opacity: "70%",
            }}
          />
          <div className="h-3/5 w-3/5 border-4 border-green-500 rounded-full">
            <Avatar src={auth.currentUser?.photoURL || ""} size="full" />
          </div>
        </div>
        <Text className="text-2xl sm:text-3xl">
          {auth.currentUser?.displayName}
        </Text>
        <Text className="text-md sm:text-lg opacity-80">
          {"@" + userDoc?.username}
        </Text>
        <Badges
          codchefHandle={userDoc?.codechefHandle || ""}
          codeforcesHandle={userDoc?.codeforcesHandle || ""}
        />
      </div>
    </Layout>
  );
};

export default Home;
