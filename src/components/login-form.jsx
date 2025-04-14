import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { EyeIcon, EyeOffIcon, Watch } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorMessage } from "@hookform/error-message"
import { useUser } from "@/contexts/UserProvider"
import { useNavigate } from "react-router"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {message: 'Campo richiesto'})
})
export function LoginForm({
  className,
  ...props
}) {

  const { watch, register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const email = watch('email'); /* watch  */

  const [ showPassword, setShowPassword ] = useState(false);
  const { handleLogin } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const error = await handleLogin(data);
    if(error) {
      console.log(error);
      setError('email', {type: 'custom', message:""});
      setError('password', {type: 'custom', message:error});
    } else {
      navigate('/');
    }
  }
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2"> 
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')} value={email.replace(/\s/g, "")} id="email" type="text" inputMode='email' placeholder="m@example.com" className={cn(errors.email && 'border-destructive')}/> {/* inputMode='email' da mobile fa comparire la @ */}
                <ErrorMessage 
                  name={'email'} 
                  errors={errors} 
                  render={({message}) => message && <p className="text-destructive text-xs">{message}</p> }/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input {...register('password')} id="password" type={showPassword ? "text" : "password"} className={cn(errors.password && 'border-destructive')}/>
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOffIcon className="size-4"/> : <EyeIcon className="size-4"/>}
                  </div>
                </div>
                <ErrorMessage 
                  name={'password'} 
                  errors={errors} 
                  render={({message}) => message && <p className="text-destructive text-xs">{message}</p> }/>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}

