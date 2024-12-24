import { Login as LoginForm } from "@/features/login/Login"

const Login = () => {
  return (
    <div className="bg-whit">
      <div className="flex justify-center h-screen">
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">LOGO</div>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Sign in to access your account
              </p>
            </div>

            <LoginForm />
            {/* <p className="mt-6 text-sm text-center text-gray-400">
              Don&#x27;t have an account yet?{" "}
              <a
                href="https://google.com"
                className="text-blue-500 focus:outline-none focus:underline hover:underline"
              >
                Sign up
              </a>
              .
            </p> */}
          </div>
        </div>
        <div className="hidden bg-cover lg:block lg:w-2/3">
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Patient Registry
              </h2>

              <p className="max-w-xl mt-3 text-gray-300">IACR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
