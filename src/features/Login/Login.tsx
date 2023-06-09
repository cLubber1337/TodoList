import React from "react"
import { FormikHelpers, useFormik } from "formik"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { getIsLoggedIn } from "features/Login/auth.selector"
import { LoginParamsType } from "api/auth.api"
import { authThunks } from "features/Login/auth.slice"
import { ResponseType } from "common/types"
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import { useActions } from "common/hooks"
import { useLoginStyles } from "features/Login/login.styles"
import { Box } from "@mui/material"

type FormikErrorType = Partial<Omit<LoginParamsType, "captcha">>

export const Login = () => {
  const classes = useLoginStyles()
  const isLoggedIn = useSelector(getIsLoggedIn)
  const { loginThunk } = useActions(authThunks)

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Required"
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more"
      }

      return errors
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      loginThunk(values)
        .unwrap()
        .catch((reason: ResponseType) => {
          const { fieldsErrors } = reason
          if (fieldsErrors) {
            fieldsErrors.forEach((fieldError) => {
              formikHelpers.setFieldError(fieldError.field, fieldError.error)
            })
          }
        })
    },
  })

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Box className={classes.main}>
      <h1 className={classes.h1}>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormGroup>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              className={classes.textField}
              label="Email"
              variant="outlined"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className={classes.error}>{formik.errors.email}</p>
            )}
            <TextField
              className={classes.textField}
              type="password"
              label="Password"
              variant="outlined"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={classes.error}>{formik.errors.password}</p>
            )}
            <FormControlLabel
              label={"Remember me"}
              control={
                <Checkbox
                  {...formik.getFieldProps("rememberMe")}
                  checked={formik.values.rememberMe}
                />
              }
            />
            <Button
              type={"submit"}
              variant={"contained"}
              disabled={!(formik.isValid && formik.dirty)}
              color={"primary"}
            >
              Login
            </Button>
          </FormGroup>
          <FormLabel>
            <p>
              To log in get registered{" "}
              <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noreferrer">
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p> Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
        </FormControl>
      </form>
    </Box>
  )
}
