/**
 * 使用React hook form和zod验证封装后的form控件.
 */
import { zodResolver } from "@hookform/resolvers/zod"
import MUITextField, {
  TextFieldProps as MUITextFieldProps,
} from "@mui/material/TextField"
import {
  FieldValues,
  FormProvider,
  useController,
  UseControllerProps,
  useForm as useFormRHF,
} from "react-hook-form"
import { z } from "zod"

export function useForm<T extends z.ZodTypeAny>(
  schema: T,
  defaultValues: z.infer<T>
) {
  return useFormRHF<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })
}

type TextFieldProps<T extends FieldValues> = Omit<
  MUITextFieldProps,
  "name" | "inputRef" | "onChange" | "value" | "onBlur" | "helperText" | "error"
> &
  UseControllerProps<T>

export function TextField<T extends FieldValues>(props: TextFieldProps<T>) {
  const { field, fieldState } = useController(props)
  return (
    <MUITextField
      {...props}
      name={field.name}
      inputRef={field.ref}
      helperText={fieldState.error?.message}
      error={fieldState.invalid}
      onChange={field.onChange}
      value={field.value}
      onBlur={field.onBlur}
    />
  )
}

export { FormProvider }
