import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { Exclude, Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MappingDto {
    @IsString()
    @IsNotEmpty()
    @Expose({ name: 'property_name' })
    propertyName: string;

    @IsString()
    @IsNotEmpty()
    @Expose({ name: 'property_label' })
    propertyLabel: string;

    @IsString()
    @IsOptional()
    description: string;
}

export class CreateMappingDto {
    @Exclude()
    userId: number;

    @Exclude()
    entity: IntegrationHistoryEntity;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    mapping: MappingDto[];
}