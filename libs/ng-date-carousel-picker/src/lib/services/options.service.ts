import { Injectable } from '@angular/core';
import { IPickerOptions } from '../models/interfaces';

@Injectable()
export class OptionsService {
  private options!: IPickerOptions;

  public getOptions(): IPickerOptions {
    return this.options;
  }

  public setOptions(options: IPickerOptions): void {
    this.options = options;
  }
}
