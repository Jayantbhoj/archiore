import { isSignedInAction } from "@/app/actions";
import { notFound } from "next/navigation";
import UserHeader from "./UserHeader";
import Navbar from "@/components/Navbar";
import LandingNavbar from "@/components/LandingNavbar";
import UserBody from "./UserBody";

type Props = {
  params: { username?: string };
};

export default async function UserPage() {

  const { signedIn } = await isSignedInAction(); // Now properly cached

  return (
    <>
      {signedIn ? <Navbar /> : <LandingNavbar />}
      <UserHeader />
      <UserBody/>
    </>
  );
}
