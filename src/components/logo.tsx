import { RocketIcon } from '@radix-ui/react-icons'

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-1 rounded-md bg-background">
      <span className="sr-only">Rocket</span>
      <RocketIcon className="h-5 w-5 text-primary" />
      <h1 className=" font-bold text-foreground  ">Micro-Saas</h1>
    </div>
  )
}
