

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-[#292935] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-10 items-center justify-center rounded-md">
            <img src="/ciel-logo.png" alt="Logo" height={40} width={40} className="bg-transparent"/>
          </div>
         <span className="text-white font-bold text-lg">Ciel</span> 
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
