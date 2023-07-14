/**
 * React Hook Form Components.
 */
import MUITextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"

type TextFieldParams = Omit<
  Parameters<typeof MUITextField>[0],
  "onChange" | "value" | "onBlur" | "helperText" | "error"
> & {
  name: string
  control: any
}

export function TextField(props: TextFieldParams) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <MUITextField
          {...props}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
        />
      )}
    ></Controller>
  )
}
