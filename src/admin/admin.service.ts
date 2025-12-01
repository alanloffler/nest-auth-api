import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Admin } from "@admin/entities/admin.entity";
import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateAdminDto } from "@admin/dto/create-admin.dto";
import { UpdateAdminDto } from "@admin/dto/update-admin.dto";

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepository: Repository<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<ApiResponse<Admin>> {
    const checkIc = await this.checkIcAvailability(createAdminDto.ic);
    if (checkIc.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

    const createAdmin = this.adminRepository.create(createAdminDto);
    const saveAdmin = await this.adminRepository.save(createAdmin);
    if (!saveAdmin) throw new HttpException("Error al crear admin", HttpStatus.BAD_REQUEST);

    return ApiResponse.created<Admin>("Admin creado", saveAdmin);
  }

  async findAll(): Promise<ApiResponse<Admin[]>> {
    const admins = await this.adminRepository.find({
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
      ],
    });
    if (!admins) throw new HttpException("Admins no encontrados", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin[]>("Admins encontrados", admins);
  }

  async findOne(id: string): Promise<ApiResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
      ],
    });
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin encontrado", admin);
  }

  async findOneWithCredentials(id: string): Promise<ApiResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });
    console.log(admin);
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin encontrado", admin);
  }

  async findOneWithToken(id: string): Promise<ApiResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: [
        "id",
        "ic",
        "userName",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "roleId",
        "createdAt",
        "updatedAt",
        "refreshToken",
      ],
    });
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin encontrado", admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<ApiResponse<Admin>> {
    const result = await this.adminRepository.update(id, updateAdminDto);
    if (!result) throw new HttpException("Error al actualizar admin", HttpStatus.BAD_REQUEST);

    const updatedAdmin = await this.findOneById(id);
    if (!updatedAdmin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin actualizado", updatedAdmin);
  }

  async remove(id: string): Promise<ApiResponse<Admin>> {
    const adminToRemove = await this.findOneById(id);

    const result = await this.adminRepository.remove(adminToRemove);
    if (!result) throw new HttpException("Error al eliminar admin", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Admin>("Admin eliminado", result);
  }

  public async findOneByEmail(email: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });

    return admin;
  }

  public async getAdmin(id: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: ["id", "ic", "email", "userName", "firstName", "lastName", "role"],
    });

    return admin;
  }

  public async checkIcAvailability(ic: string): Promise<ApiResponse<boolean>> {
    const admin = await this.adminRepository.findOne({ where: { ic: ic } });
    return ApiResponse.success<boolean>("Disponibilidad de DNI", admin ? false : true);
  }

  private async findOneById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return admin;
  }
}
