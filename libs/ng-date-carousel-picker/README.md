# ng-date-carousel-picker

Angular library with custom date picker, which differs from other similar components in design, scroll and calendar in the end of period (if specific property set to `true`).

## Motivation

Sometime ago I needed a datepicker in one of my pet project. I wanted to make it *BeAuTiFuL*. *BeAuTiFuL* means great, gorgeous, usable, user-friendly. *BeAuTiFuL* can also be described by this meme:

![BeAuTiFuL meaning](https://i.ytimg.com/vi/7ADUWRW__xk/hqdefault.jpg "BeAuTiFuL")

I created a component, but only inside of that pet project. So I thought it would be great if it was a separate component that could be reused...

## Usage

1. Install library:

```bash
npm i ng-date-carousel-picker
```

2. Import the component:

```typescript
// ...
import { NgDateCarouselPickerComponent } from 'ng-date-carousel-picker';

@Component({
  // ...
  imports: [NgDateCarouselPickerComponent]
})
export class SomeComponent {
  // ...
}
```

3. Add in template:

```html
<ng-date-carousel-picker></ng-date-carousel-picker>
```

## Input properties

> [!IMPORTANT]  
> All input properties are optional. If you didn't provide a value, it would set default value.

| Name                | Type             | Description                                                                                         | Default               |
|:-------------------:|:----------------:|:--------------------------------------------------------------------------------------------------- |:---------------------:|
| scrollShift         | number           | Distance (in px) which scrolls with button click. By default is `150`.                              | 150                   |
| startDate           | Date             | Date of period beginning. By default is current date.                                               | new Date()            |
| endDate             | Date             | Date of period end. By default is exactly 3 months more than current date.                          | new Date() + 3 months |
| showCalendar        | boolean          | Need to show calendar instead of scroll button in the end of period. By default is `true`.          | true                  |
| firstDayOfWeekIndex | number           | Order (number) for first day of the week, `0` is for Sunday, `1` is for Monday. By default is `1`.  | 1                     |
| weekendIndexes      | number[]         | Numbers for weekend days. By default `[0, 6]`.                                                      | [0, 6]                |

## Output properties

| Name              | Description                                                              |
|:-----------------:|:------------------------------------------------------------------------ |
| changed           | Emitter of changed value. Can be `null`, one day or range.               |

> [!NOTE]  
> You can see scripts for library in [root README](../../README.md).

