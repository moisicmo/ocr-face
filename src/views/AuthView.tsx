import { ComponentButton, ComponentInput } from "@/components"
import { useForm } from "@/hooks"
import { Grid, Typography } from "@mui/material"
import { useState } from "react"

const loginFormFields = {
  identityCard: '',
}
const formValidations = {
  identityCard: [(value: any) => value.length >= 1, 'Debe ingresar su cuenta'],
}

export const AuthView = () => {


  const [formSubmitted, setFormSubmitted] = useState(false);
  const { identityCard, onInputChange, isFormValid, identityCardValid, } = useForm(loginFormFields, formValidations);

  const loginSubmit = (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    // startLogin({ identityCard: identityCard, password: password });
  }
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '90vh' }}>
      <Grid item xs={12} sm={6}>
        {/* <img src={imagelogo} alt="Descripción de la imagen" style={{ maxHeight: '80%', maxWidth: '80%' }} /> */}
      </Grid>
      <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <Typography>ARRIENDOS</Typography> */}
        <form onSubmit={loginSubmit}>
          <ComponentInput
            type="text"
            label="Carnet"
            name="identityCard"
            value={identityCard}
            onChange={onInputChange}
            error={!!identityCardValid && formSubmitted}
            helperText={formSubmitted ? identityCardValid : ''}
          />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={3}>
              <ComponentButton text="1" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="2" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="3" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="4" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="1" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="2" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="3" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="4" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="1" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="2" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="3" sx={{ width: "100%", px: 1 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ComponentButton text="4" sx={{ width: "100%", px: 1 }} />
            </Grid>
          </Grid>
          <ComponentButton type="submit" text="INGRESAR" />
        </form>
      </Grid>
    </Grid >
  )
}
