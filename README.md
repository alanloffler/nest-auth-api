<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) auth API:
Manage users login and registration.

Supports user roles and permissions.
Authenticated routes can be protected by role-based access control and authorization.
Local strategy and JWT strategy.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Enviroment file example (.env)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_DATABASE=your_db_name
JWT_SECRET=token_secret
JWT_EXPIRES_IN=1m
JWT_REFRESH_SECRET=refreshtoken_secret
JWT_REFRESH_EXPIRES_IN=2m
```

Expires times are in minutes for testing purposes. Modify JWT_EXPIRES_IN and JWT_REFRESH_EXPIRES_IN to your needs.

Suggested values:

JWT_EXPIRES_IN=15m  
JWT_REFRESH_EXPIRES_IN=5d

Role permission: use JwtAuthGuard and RolesGuard to access the endpoints (implemented in admin and roles controllers).

## Stay in touch

- Author - [Alan Löffler](https://github.com/alanloffler)

## License

nest-auth-api is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
