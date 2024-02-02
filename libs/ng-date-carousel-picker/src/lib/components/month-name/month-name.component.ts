import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { IMonth } from '../../models/interfaces';
import { InternalizationService } from '../../services';

/** Компонент названия месяца */
@Component({
  selector: 'dcp-month-name',
  templateUrl: './month-name.component.html',
  styleUrls: ['./month-name.component.scss'],
  providers: [InternalizationService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthNameComponent implements OnInit {
  private readonly internalizationService: InternalizationService = inject(InternalizationService);

  /** Месяц */
  @Input({ required: true }) public month!: IMonth;

  /** Является ли активным */
  @Input({ required: true })
  @HostBinding('class.active')
  public isActive: boolean = false;

  public name: string = '';

  /** Ccылка на элемент названия */
  @ViewChild('name_ref') public readonly ref!: ElementRef<HTMLParagraphElement>;

  public ngOnInit(): void {
    this.name = this.internalizationService.capitalizedMonthNames[this.month.order];
  }
}
