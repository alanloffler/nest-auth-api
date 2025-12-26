import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

import { EModule } from "@common/enums/module.enum";

export class CreateSettingDto {
  @MinLength(3, { message: "La llave debe tener al menos 3 caracteres" })
  @IsString({ message: "La llave debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La llave es obligatoria" })
  key: string;

  @MinLength(3, { message: "El valor debe tener al menos 3 caracteres" })
  @IsString({ message: "El valor debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El valor es obligatorio" })
  value: string;

  @IsEnum(EModule, {
    message: `El módulo debe ser uno de los siguientes: ${Object.values(EModule).join(", ")}`,
  })
  @IsNotEmpty({ message: "El módulo es obligatorio" })
  module: EModule;
}
