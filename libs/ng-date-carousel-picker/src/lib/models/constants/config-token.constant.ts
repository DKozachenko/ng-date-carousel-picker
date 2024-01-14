import { InjectionToken } from '@angular/core';
import { IConfig } from '../interfaces';

/** Токен для конфига */
export const PICKER_CONFIG: InjectionToken<IConfig> = new InjectionToken<IConfig>('config');
