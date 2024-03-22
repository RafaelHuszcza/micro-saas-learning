import { ErrorMessage as Error } from '@hookform/error-message'
import { FieldErrors } from 'react-hook-form'
interface ErrorMessageProps {
  errors: FieldErrors
  name: string
}
export function ErrorMessage({ errors, name }: ErrorMessageProps) {
  return (
    <Error
      errors={errors}
      name={name}
      render={({ message }: { message: string }) => (
        <p className="text-sm text-destructive">{message}</p>
      )}
    />
  )
}
