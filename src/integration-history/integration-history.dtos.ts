import { IntegrationHistoryProcess } from '@entities/integration-history/history.process.enum';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHistoryParamsDto {
    @Transform(({ value }) => Number.parseInt(value))
    @IsNumber()
    @IsNotEmpty()
    clienId: number;

    @IsNotEmpty()
    @IsEnum(IntegrationKey)
    integrationKey: IntegrationKey;
}

export class CreateHistoryDto {
    @IsEnum(IntegrationHistoryType)
    type: IntegrationHistoryType;

    @IsEnum(IntegrationHistoryProcess)
    process: string;

    @IsString()
    @IsNotEmpty()
    operation: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsObject()
    @IsOptional()
    oldObject?: Record<string, any>;

    @IsObject()
    @IsNotEmpty()
    newObject: Record<string, any>;
}
