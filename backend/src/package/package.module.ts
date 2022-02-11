import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Package } from 'src/schemas/package.schema';
import { PackageService } from './package.service';

@Module({
  imports: [TypegooseModule.forFeature([Package])],
  providers: [PackageService],
  exports: [PackageService]
})
export class PackageModule {}
