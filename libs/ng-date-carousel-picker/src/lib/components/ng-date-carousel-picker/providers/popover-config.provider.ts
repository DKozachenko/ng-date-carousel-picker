import { Provider } from '@angular/core';
import { flip, offset, shift } from '@ngx-popovers/core';
import { NGX_POPOVER_CONFIG, NgxPopoverConfig } from '@ngx-popovers/popover';

export const PopoverConfigProvider: Provider = {
  provide: NGX_POPOVER_CONFIG,
  useValue: new NgxPopoverConfig({
    placement: 'bottom-end',
    autoUpdate: true,
    arrow: false,
    closeOnClickedOutside: true,
    middleware: [flip(), shift(), offset(5)],
  }),
};
