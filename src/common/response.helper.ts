export class Response<T> {
  statusCode: number;
  message: string;
  data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static created<T>(message: string, data?: T): Response<T> {
    return new Response(201, message, data);
  }

  static success<T>(message: string, data?: T): Response<T> {
    return new Response(200, message, data);
  }

  static removed<T>(message: string, data?: T): Response<T> {
    return new Response(200, message, data);
  }
}
