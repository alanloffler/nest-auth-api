import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, MinLength } from "class-validator";

export class CreateAdminDto {
  @Length(8, 8, { message: "El DNI debe tener 8 caracteres" })
  @IsString({ message: "El DNI debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El DNI es obligatorio" })
  ic: string;

  @MinLength(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
  @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre de usuario es obligatorio" })
  userName: string;

  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  firstName: string;

  @MinLength(3, { message: "El apellido debe tener al menos 3 caracteres" })
  @IsNotEmpty({ message: "El apellido es obligatorio" })
  lastName: string;

  @IsEmail({}, { message: "El correo electrónico no es válido" })
  @IsNotEmpty({ message: "El correo electrónico es obligatorio" })
  email: string;

  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  password: string;

  @Length(10, 10, { message: "El número de teléfono debe tener 10 caracteres" })
  @IsString({ message: "El número de teléfono debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El número de teléfono es obligatorio" })
  phoneNumber: string;

  @IsUUID()
  @IsNotEmpty({ message: "El rol es obligatorio" })
  roleId: string;
}
