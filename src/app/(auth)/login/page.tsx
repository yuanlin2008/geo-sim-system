"use client"

import React from "react"
import { AppConfig } from "@/config"
import { zodResolver } from "@hookform/resolvers/zod"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import LoadingButton from "@mui/lab/LoadingButton"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import { UserLoginSchema } from "@/lib/schema"
import { TextField } from "@/components/RHF"

const Login = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [provider, setProvider] = React.useState<string | null>(null)

  // Credential Login
  function CredentialLogin() {
    const { control, handleSubmit } = useForm<UserLoginSchema>({
      resolver: zodResolver(UserLoginSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    })

    async function onSubmit(data: UserLoginSchema) {
      console.log(data)
      setIsLoading(true)
      setProvider("credentials")
      // todo
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
    return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          disabled={isLoading}
          control={control}
          margin="normal"
          fullWidth
          label="用户名"
          name="username"
          autoComplete="username"
          autoFocus
          size="small"
        />
        <TextField
          disabled={isLoading}
          control={control}
          margin="normal"
          fullWidth
          name="password"
          label="密码"
          type="password"
          autoComplete="current-password"
          size="small"
        />
        <LoadingButton
          loading={isLoading && provider == "credentials"}
          disabled={isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          登录
        </LoadingButton>
      </Box>
    )
  }

  // Auth Login
  interface AuthLoginProps {
    provider: string
    text: string
  }
  function AuthLogin(props: AuthLoginProps) {
    return (
      <Box sx={{ mt: 1 }}>
        <LoadingButton
          disabled={isLoading}
          loading={isLoading && provider == props.provider}
          fullWidth
          variant="outlined"
          onClick={() => {
            setIsLoading(true)
            setProvider(props.provider)
            signIn(props.provider)
          }}
        >
          {props.text}
        </LoadingButton>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ my: 4 }}>
        <Typography component="h1" variant="h3">
          {AppConfig.appName}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
      </Box>
      <Typography component="h2" variant="h5">
        请登录您的账号
      </Typography>
      <Box sx={{ mt: 1, maxWidth: 300 }}>
        <CredentialLogin />
        <Divider>或者</Divider>
        <AuthLogin provider="github" text="使用Github账号登录" />
      </Box>
    </Box>
  )
}

export default Login
