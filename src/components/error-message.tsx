import { FieldErrors } from "react-hook-form"
import { ErrorMessage as Error } from "@hookform/error-message"
interface ErrorMessageProps {
  errors: FieldErrors
  name: string
}
export function ErrorMessage({ errors, name }: ErrorMessageProps) {
  return (
    <Error
      errors={errors}
      name={name}
      render={({ message }: { message: string }) => <p className="text-destructive text-sm">{message}</p>}
    />
  )
}
