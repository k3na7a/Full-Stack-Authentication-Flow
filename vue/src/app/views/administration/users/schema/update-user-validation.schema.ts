import { Role } from '@/library/data/dto/user.dto'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  role: Yup.mixed<Role>().oneOf(Object.values(Role)).required(),
  avatar: Yup.mixed<File>().notRequired(),
  'remove-avatar': Yup.boolean().required()
})

export { validationSchema }