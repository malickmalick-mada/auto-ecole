import { SignUpForm } from "@/components/form/SignUpForm";
import Header from "@/components/header";

export default function SignUpPage() {
  return (
    <div className="w-full h-screen">
      <Header />
      <main className="container mx-auto  sm:px-6 py-10 flex items-center justify-center">
        <div className="w-[320px] sm:w-[380px]">
          <SignUpForm />
        </div>
      </main>
    </div>
  );
}
