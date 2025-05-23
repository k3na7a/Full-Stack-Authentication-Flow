import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

export { validationSchema }
