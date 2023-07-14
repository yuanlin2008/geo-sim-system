import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"

type Params = Omit<
  Parameters<typeof TextField>[0],
  "onChange" | "value" | "onBlur" | "helperText" | "error"
> & {
  name: string
  control: any
}

export default function RHFTextField(props: Params) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
        formState,
      }) => (
        <TextField
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
