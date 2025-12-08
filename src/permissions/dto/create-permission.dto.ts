import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePermissionDto {
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  name: string;

  @MinLength(3, { message: "La categoría debe tener al menos 3 caracteres" })
  @IsString({ message: "La categoría debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La categoría es obligatoria" })
  category: string;

  @MinLength(3, { message: "La acción debe tener al menos 3 caracteres" })
  @IsString({ message: "La acción debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La acción es obligatoria" })
  actionKey: string;

  @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
  @IsNotEmpty({ message: "La descripción es obligatoria" })
  description: string;
}
