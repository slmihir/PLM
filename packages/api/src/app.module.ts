import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { UniverseModule } from './modules/universe/universe.module';
import { ProductsModule } from './modules/products/products.module';
import { TechPacksModule } from './modules/tech-packs/tech-packs.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    DatabaseModule,
    UniverseModule,
    ProductsModule,
    TechPacksModule,
    WorkflowModule,
    CommentsModule,
  ],
})
export class AppModule {}

