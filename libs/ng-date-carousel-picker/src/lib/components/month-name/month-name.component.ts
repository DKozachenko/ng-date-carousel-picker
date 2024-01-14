import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ILocalization, IMonth } from '../../models/interfaces';
import { MonthEng, MonthRu } from '../../models/types';
import { monthOrderNames } from '../../models/constants';

/** Компонент названия месяца */
@Component({
  selector: 'dcp-month-name',
  templateUrl: './month-name.component.html',
  styleUrls: ['./month-name.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthNameComponent implements OnInit {
  /** Месяц */
  @Input({ required: true }) public month!: IMonth;

  /** Является ли активным */
  @Input({ required: true })
  @HostBinding('class.active')
  public isActive: boolean = false;

  /** Русское название */
  public ruName!: MonthRu;

  /** Ccылка на элемент названия */
  @ViewChild('name') public readonly ref!: ElementRef<HTMLParagraphElement>;

  public ngOnInit(): void {
    const localization: ILocalization<MonthEng, MonthRu> = <ILocalization<MonthEng, MonthRu>>(
      monthOrderNames.get(this.month.order)
    );
    this.ruName = localization.ru;
  }
}
