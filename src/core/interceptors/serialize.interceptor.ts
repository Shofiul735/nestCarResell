import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Observable, map } from 'rxjs';

export function Serialize(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializerInterceptor(dto));
}

export class SerializerInterceptor<T extends ClassConstructor<unknown>>
  implements NestInterceptor
{
  constructor(private readonly dto: T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // before a request is handled by the request handler
    console.log('before handler');

    // after handler
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
