import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
  @MinLength(3, { message: "El nombre del rol debe tener al menos 3 caracteres" })
  @IsString({ message: "El nombre del rol debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre del rol es obligatorio" })
  name: string;

  @MinLength(3, { message: "El valor del rol debe tener al menos 3 caracteres" })
  @IsString({ message: "El valor del rol debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El valor del rol es obligatorio" })
  value: string;

  @MinLength(3, { message: "La descripción del rol debe tener al menos 3 caracteres" })
  @IsString({ message: "La descripción del rol debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La descripción del rol es obligatoria" })
  description: string;

  @ArrayNotEmpty({ message: "Debes proporcionar al menos un permiso" })
  @IsArray({ message: "Los permisos del rol deben ser un array" })
  permissions: {
    id: string;
    actions: {
      id: string;
      key: string;
      value: boolean;
    }[];
  }[];
}
