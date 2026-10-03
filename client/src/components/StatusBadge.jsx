import { Clock, CheckCircle2, Truck, Package, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    pending: {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      label: 'Pending Approval',
    },
    accepted: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2,
      label: 'Accepted by Farmer',
    },
    shipped: {
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Truck,
      label: 'Out for Dispatch',
    },
    delivered: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Package,
      label: 'Delivered',
    },
    cancelled: {
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle,
      label: 'Cancelled',
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
