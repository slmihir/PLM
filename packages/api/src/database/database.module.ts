import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Fabric } from './entities/fabric.entity';
import { Trim } from './entities/trim.entity';
import { Print } from './entities/print.entity';
import { Color } from './entities/color.entity';
import { Product } from './entities/product.entity';
import { ProductFabric } from './entities/product-fabric.entity';
import { ProductTrim } from './entities/product-trim.entity';
import { ProductSketch } from './entities/product-sketch.entity';
import { TechPack } from './entities/tech-pack.entity';
import { SizeSpec } from './entities/size-spec.entity';
import { Comment } from './entities/comment.entity';
import { WorkflowStage } from './entities/workflow-stage.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'virgio'),
        password: configService.get('DB_PASSWORD', 'virgio123'),
        database: configService.get('DB_NAME', 'virgio_plm'),
        entities: [
          User,
          Fabric,
          Trim,
          Print,
          Color,
          Product,
          ProductFabric,
          ProductTrim,
          ProductSketch,
          TechPack,
          SizeSpec,
          Comment,
          WorkflowStage,
        ],
        synchronize: false, // Disabled due to PostgreSQL permissions bug with TypeORM
        logging: configService.get('NODE_ENV') === 'development',
        extra: {
          // Force new connections to pick up latest permissions
          max: 10,
          connectionTimeoutMillis: 5000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

