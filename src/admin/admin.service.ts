import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Admin } from "@admin/entities/admin.entity";
import { ApiResponse } from "@common/helpers/api-response.helper";
import { CreateAdminDto } from "@admin/dto/create-admin.dto";
import { UpdateAdminDto } from "@admin/dto/update-admin.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private readonly configService: ConfigService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<ApiResponse<Admin>> {
    const checkIc = await this.checkIcAvailability(createAdminDto.ic);
    if (checkIc.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);

    const checkEmail = await this.checkEmailAvailability(createAdminDto.email);
    if (checkEmail.data === false) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);

    const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
    const hashedPassword = await bcrypt.hash(createAdminDto.password, saltRounds);

    const createAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

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

  async findAllSoftRemoved(): Promise<ApiResponse<Admin[]>> {
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
        "deletedAt",
      ],
      withDeleted: true,
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

  async findOneSoftRemoved(id: string): Promise<ApiResponse<Admin>> {
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
        "deletedAt",
      ],
      withDeleted: true,
    });
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin encontrado", admin);
  }

  async findOneWithCredentials(id: string): Promise<ApiResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });
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
    const user = await this.findOneById(id);

    if (updateAdminDto.ic && updateAdminDto.ic !== user.ic) {
      const icAvailable = await this.checkIcAvailability(updateAdminDto.ic);
      if (icAvailable.data === false) throw new HttpException("DNI ya registrado", HttpStatus.BAD_REQUEST);
    }

    if (updateAdminDto.userName && updateAdminDto.userName !== user.userName) {
      const userNameAvailable = await this.checkUsernameAvailability(updateAdminDto.userName);
      if (userNameAvailable.data === false)
        throw new HttpException("Nombre de usuario ya registrado", HttpStatus.BAD_REQUEST);
    }

    if (updateAdminDto.email && updateAdminDto.email !== user.email) {
      const emailAvailable = await this.checkEmailAvailability(updateAdminDto.email);
      if (emailAvailable.data === false) throw new HttpException("Email ya registrado", HttpStatus.BAD_REQUEST);
    }

    if (updateAdminDto.password) {
      const saltRounds = parseInt(this.configService.get("BCRYPT_SALT_ROUNDS") || "10");
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, saltRounds);
    }

    const result = await this.adminRepository.update(id, updateAdminDto);
    if (!result) throw new HttpException("Error al actualizar admin", HttpStatus.BAD_REQUEST);

    const updatedAdmin = await this.findOneById(id);
    if (!updatedAdmin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return ApiResponse.success<Admin>("Admin actualizado", updatedAdmin);
  }

  async softRemove(id: string): Promise<ApiResponse<Admin>> {
    const adminToRemove = await this.findOneById(id);

    const result = await this.adminRepository.softRemove(adminToRemove);
    if (!result) throw new HttpException("Error al eliminar admin", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Admin>("Admin eliminado", result);
  }

  async remove(id: string): Promise<ApiResponse<Admin>> {
    const adminToRemove = await this.findOneById(id);

    const result = await this.adminRepository.remove(adminToRemove);
    if (!result) throw new HttpException("Error al eliminar admin", HttpStatus.BAD_REQUEST);

    return ApiResponse.removed<Admin>("Admin eliminado", result);
  }

  async restore(id: string): Promise<ApiResponse<Admin>> {
    const adminToRestore = await this.adminRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!adminToRestore) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    const result = await this.adminRepository.restore(adminToRestore.id);
    if (!result) throw new HttpException("Error al restaurar admin", HttpStatus.BAD_REQUEST);

    const restoredAdmin = await this.findOneById(id);

    return ApiResponse.success<Admin>("Admin restaurado", restoredAdmin);
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

  public async checkEmailAvailability(email: string): Promise<ApiResponse<boolean>> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    return ApiResponse.success<boolean>("Disponibilidad de email", admin ? false : true);
  }

  public async checkIcAvailability(ic: string): Promise<ApiResponse<boolean>> {
    const admin = await this.adminRepository.findOne({ where: { ic } });
    return ApiResponse.success<boolean>("Disponibilidad de DNI", admin ? false : true);
  }

  public async checkUsernameAvailability(userName: string): Promise<ApiResponse<boolean>> {
    const username = await this.adminRepository.findOne({ where: { userName } });
    return ApiResponse.success<boolean>("Disponibilidad de nombre de usuario", username ? false : true);
  }

  private async findOneById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new HttpException("Admin no encontrado", HttpStatus.NOT_FOUND);

    return admin;
  }
}
