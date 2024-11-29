import { Metadata } from "next";
import { HomeComponent } from "./components/home";

export const metadata: Metadata = {
  title: "Magic Utils",
  description: "A collection of utility to make your life easier",
}

export default function Home() {
  return (
    <HomeComponent />
  );
}
