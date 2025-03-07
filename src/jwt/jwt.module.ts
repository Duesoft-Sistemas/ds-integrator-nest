import { Module } from "@nestjs/common";
import { JwtServiceInternal } from "./jwt.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({ global: true })],
    providers: [JwtServiceInternal],
    exports: [JwtServiceInternal]
})
export class JwtModuleInternal {}