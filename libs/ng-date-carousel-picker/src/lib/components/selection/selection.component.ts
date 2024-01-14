import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';

/** Компонент дня выделения диапазона */
@Component({
  selector: 'dcp-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionComponent {
  /** Ссылка на элемент выделения диапазона */
  @ViewChild('selection') private readonly selection!: ElementRef<HTMLDivElement>;

  /** Ссылка на элемент выделения левой половинки */
  @ViewChild('left_half') private readonly leftHalf!: ElementRef<HTMLDivElement>;

  /** Ссылка на элемент выделения правой половинки */
  @ViewChild('right_half') private readonly rightHalf!: ElementRef<HTMLDivElement>;

  /** Ссылка на элемент обертки выделения левой половинки */
  @ViewChild('right_half_wrapper') private readonly rightHalfWrapper!: ElementRef<HTMLDivElement>;

  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Установка ширины элемента выделения
   * @param value значение
   */
  private setSelectionWidth(value: number): void {
    this.renderer.setStyle(this.selection.nativeElement, 'width', `${value}px`);
    this.renderer.setStyle(this.selection.nativeElement, 'max-width', `${value}px`);
  }

  /**
   * Установка отступа слева элемента выделения
   * @param value значение
   */
  public setSelectionLeft(value: number): void {
    this.renderer.setStyle(this.selection.nativeElement, 'left', `${value}px`);
  }

  /**
   * Выделение
   * @param width ширина выделения диапазона
   */
  public select(width: number): void {
    this.renderer.setStyle(this.leftHalf.nativeElement, 'left', `${width / 2}px`);
    this.renderer.setStyle(this.leftHalf.nativeElement, 'max-width', `${width / 2}px`);
    this.renderer.setStyle(this.leftHalf.nativeElement, 'opacity', 1);

    this.renderer.setStyle(this.rightHalf.nativeElement, 'max-width', `${width / 2}px`);
    this.renderer.setStyle(this.rightHalf.nativeElement, 'opacity', 1);
    this.renderer.setStyle(this.rightHalfWrapper.nativeElement, 'max-width', `${width / 2}px`);

    this.setSelectionWidth(width);
  }

  /** Отмена выделения диапазона */
  public unselect(): void {
    this.renderer.setStyle(this.leftHalf.nativeElement, 'left', '0px');
    this.renderer.setStyle(this.leftHalf.nativeElement, 'max-width', '0px');
    this.renderer.setStyle(this.leftHalf.nativeElement, 'opacity', 0);

    this.renderer.setStyle(this.rightHalf.nativeElement, 'max-width', '0px');
    this.renderer.setStyle(this.rightHalf.nativeElement, 'opacity', 0);
    this.renderer.setStyle(this.rightHalfWrapper.nativeElement, 'max-width', '0px');

    this.setSelectionWidth(0);
  }
}
