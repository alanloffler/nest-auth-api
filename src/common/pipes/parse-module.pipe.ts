import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

import { EModule } from "@common/enums/module.enum";

@Injectable()
export class ParseModulePipe implements PipeTransform<string, EModule> {
  transform(value: string): EModule {
    const enumValues = Object.values(EModule) as string[];

    if (!enumValues.includes(value)) {
      throw new BadRequestException(
        `El módulo ${value} no es válido. Los valores permitidos son: ${enumValues.join(", ")}`,
      );
    }

    return value as EModule;
  }
}
