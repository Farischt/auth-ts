import { useRouter } from "next/router"
import { AuthApi } from "../../api"

const LogoutForm: React.FunctionComponent = () => {
  const router = useRouter()

  async function handleLogout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await AuthApi.logout()
    router.replace(router.asPath, undefined, { scroll: false })
  }

  return (
    <form
      method="POST"
      onSubmit={handleLogout}
      className="flex items-center justify-center"
    >
      <button
        type="submit"
        className="mt-3 rounded bg-blue-600 px-8 py-4 text-center text-sm text-white"
      >
        Sign out
      </button>
    </form>
  )
}

export default LogoutForm
