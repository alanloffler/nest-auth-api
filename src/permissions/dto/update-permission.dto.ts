import { PartialType } from "@nestjs/mapped-types";

import { CreatePermissionDto } from "@permissions/dto/create-permission.dto";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
