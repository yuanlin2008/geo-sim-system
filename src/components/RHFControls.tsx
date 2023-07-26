import React, { useContext } from "react"
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

const DisabledContext = React.createContext<boolean>(false)

export function DisabledProvider({
  children,
  disabled,
}: React.PropsWithChildren<{ disabled: boolean }>) {
  return (
    <DisabledContext.Provider value={disabled}>
      {children}
    </DisabledContext.Provider>
  )
}

export type RHFTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "inputRef" | "onChange" | "value" | "onBlur" | "helperText" | "error"
> &
  UseControllerProps<T>

export function RHFTextField<T extends FieldValues>(
  props: RHFTextFieldProps<T>
) {
  const { field, fieldState } = useController(props)
  const disabled = useContext(DisabledContext)
  return (
    <TextField
      disabled={disabled}
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

/**
 * 
  <FormControl disabled={isLoading} fullWidth margin="normal">
    <FormControlLabel
      label="测试一下这个"
      control={<RHFCheckbox name="test" />}
    />
  </FormControl>
 */
type RHFCheckboxProps<T extends FieldValues> = Omit<
  CheckboxProps,
  "name" | "inputRef" | "onChange" | "value" | "onBlur" | "helperText" | "error"
> &
  UseControllerProps<T>

export function RHFCheckbox<T extends FieldValues>(props: RHFCheckboxProps<T>) {
  const { field } = useController(props)
  const disabled = useContext(DisabledContext)
  return (
    <Checkbox
      disabled={disabled}
      {...props}
      name={field.name}
      inputRef={field.ref}
      onChange={field.onChange}
      checked={field.value}
      onBlur={field.onBlur}
    />
  )
}
