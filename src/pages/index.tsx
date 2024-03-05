import Head from "next/head";
import SnakeGame from "@/components/game/SnakeGame";
import { useState } from "react";
import Style from "@/styles/pages/Home.module.scss";

export default function Home() {
  const [score, setScore] = useState(0);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={Style.container}>
        <p>Score : {score}</p>
        <SnakeGame setScore={setScore} score={score}/>
      </div>
    </>
  );
}
