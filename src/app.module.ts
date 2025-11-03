import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AdminModule } from "@admin/admin.module";
import { AuthModule } from "@auth/auth.module";
import { RolesModule } from "@roles/roles.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
