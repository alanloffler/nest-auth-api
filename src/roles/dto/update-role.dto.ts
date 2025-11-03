import { PartialType } from "@nestjs/mapped-types";

import { CreateRoleDto } from "@roles/dto/create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
