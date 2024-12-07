"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnect } from "wagmi";

export default function Home() {
  const router = useRouter();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-8">
      <h1 className="text-8xl font-light font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-highlight">
        TuskNet
      </h1>
      <p className="text-2xl text-muted-foreground">
        Collaborative Data training platform.
      </p>
      <Button
        variant={"shine"}
        size={"lg"}
        className="font-semibold"
        onClick={() => {
          if (isConnected) {
            router.push("/dashboard");
          } else {
            connect({ connector: connectors[0] });
          }
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
