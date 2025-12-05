import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  host: configService.get("DB_HOST") || "localhost",
  port: parseInt(configService.get("DB_PORT") || "5432"),
  username: configService.get("DB_USERNAME"),
  password: configService.get("DB_PASSWORD"),
  database: configService.get("DB_DATABASE"),
  // entities: ["src/**/*.entity.ts"],
  // migrations: ["src/migrations/*.ts"],
  entities: ["dist/**/*.entity.ts"],
  migrations: ["dist/migrations/*.ts"],
  synchronize: false,
};

export const AppDataSource = new DataSource(typeOrmConfig);

export default AppDataSource;
