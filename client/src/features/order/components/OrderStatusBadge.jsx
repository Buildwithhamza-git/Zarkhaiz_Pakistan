import Badge from "../../../shared/components/Badge";

import {
  getOrderStatusMeta,
  getPaymentStatusMeta,
} from "../utils/orderDisplay";

export function OrderStatusBadge({ status }) {
  const meta = getOrderStatusMeta(status);

  return <Badge color={meta.color}>{meta.label}</Badge>;
}

export function PaymentStatusBadge({ status }) {
  const meta = getPaymentStatusMeta(status);

  return <Badge color={meta.color}>{meta.label}</Badge>;
}
