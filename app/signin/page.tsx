import { SignInForm } from "@/components/form/SignInForm";
import Header from "@/components/header";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-full h-screen">
      <Header />
      <main className="container mx-auto sm:px-6 py-10 flex items-center justify-center">
        <div className="w-[320px] sm:w-[380px]">
          <SignInForm />
        </div>
      </main>
    </div>
  );
}
