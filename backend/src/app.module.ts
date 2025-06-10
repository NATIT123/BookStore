import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { FilesModule } from './files/files.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './database/databases.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';
import { HistoryModule } from './history/history.module';
import { TransactionModule } from './transaction/transaction.module';
import { VnpayModule } from 'nestjs-vnpay';
import { HashAlgorithm, ignoreLogger } from 'vnpay';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    //Init mongodb connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ///Config module to use dotenv to use any where
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //Init VNPAY
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        hashAlgorithm: HashAlgorithm.SHA256,
        enableLog: true,
        secureSecret: configService.getOrThrow<string>('VNPAY_SECURE_SECRET'),
        tmnCode: configService.getOrThrow<string>('VNPAY_TMN_CODE'),
        loggerFn: ignoreLogger,
      }),
      inject: [ConfigService],
    }),
    VnpayModule,
    UsersModule,
    AuthModule,
    FilesModule,
    PermissionsModule,
    RolesModule,
    DatabasesModule,
    MailModule,
    HealthModule,
    BookModule,
    OrderModule,
    HistoryModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
