/**
 * React Hook Form Components.
 */
import { zodResolver } from "@hookform/resolvers/zod"
import MUITextField from "@mui/material/TextField"
import { Controller, useForm as useFormRHF } from "react-hook-form"
import { z } from "zod"

type TextFieldParams = Omit<
  Parameters<typeof MUITextField>[0],
  "onChange" | "value" | "onBlur" | "helperText" | "error"
> & {
  name: string
  control: any
}

/**
 * 封装使用zod的useForm
 * @param schema
 * @param defaultValues
 * @returns
 */
export function useForm<T extends z.Schema<any, any>>(
  schema: T,
  defaultValues?: z.infer<T>
) {
  return useFormRHF<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })
}

/**
 * 是否用react hook form的TextField
 * @param props
 * @returns
 */
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
