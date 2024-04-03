import { BadRequestException } from '@nestjs/common';
import { ValidType } from './enums';

export class Validations {
  private static instance: Validations;
  public static getInstance(): Validations {
    if (!Validations.instance) {
      Validations.instance = new Validations();
    }
    return Validations.instance;
  }

  validateWithRegex(str: string, description: string = 'campo', ...valid) {
    valid.forEach((data) => {
      if (data === ValidType.IS_NUMBER) {
        if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
          throw new BadRequestException(`O campo ${description} deve conter apenas números`);
        }
      }
    });
  }

  verifyLength(
    value: string,
    description: string = 'campo',
    min: number = null,
    max: number = null,
  ) {
    if (value === null || value === undefined || value === '') {
      throw new BadRequestException(`O campo ${description}, não pode conter espaços vazios!`);
    }

    if (min !== null) {
      if (value.length < min) {
        throw new BadRequestException(
          `O campo ${description}, não pode ter menos que ${min} caracteres!`,
        );
      }
    }

    if (max !== null) {
      if (value.length > max) {
        throw new BadRequestException(
          `O campo ${description}, não pode ter mais que ${max} caracteres!`,
        );
      }
    }
  }

  validRegex(regex: RegExp, value: string): boolean {
    return regex.test(value);
  }
}
