import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/infastructure/config/env/env';

@Injectable()
export class AppEnvironmentService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  isLive(): boolean {
    const environment = this.configService.get('environment') as string;
    return environment === 'production' || environment === 'sandbox';
  }

  isDeployed(): boolean {
    const environment = this.configService.get('environment') as string;
    return (
      environment === 'production' ||
      environment === 'sandbox' ||
      environment === 'staging'
    );
  }

  isDev(): boolean {
    const environment = this.configService.get('environment') as string;
    return environment === 'development' || environment === 'staging';
  }

  runOnLive(onLive: () => void, onSkip?: () => void): void {
    if (this.isLive()) {
      onLive();
    }
    if (onSkip) {
      onSkip();
    }
  }

  runOnDev(callback: () => void): void {
    if (this.isDev()) {
      callback();
    }
  }
}
