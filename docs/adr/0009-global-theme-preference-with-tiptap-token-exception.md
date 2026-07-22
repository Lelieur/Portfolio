# Use one global theme preference with a TipTap token exception

The Public UI surface and Admin UI surface share one global `Theme preference` with `System`, `Light`, and `Dark` modes. TipTap specialized controls follow the active mode but keep their own editor token system.

This preserves one predictable theme across the application while allowing TipTap's editor-owned primitives to retain their specialized styling vocabulary.
