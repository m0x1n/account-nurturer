import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
  selectedMetric: 'sales' | 'clients' | 'capacity';
  onMetricSelect: (metric: 'sales' | 'clients' | 'capacity') => void;
}

export function MetricsGrid({ selectedMetric, onMetricSelect }: MetricsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <MetricCard
        title="SALES"
        value="$133,201"
        change="+3% since last month"
        selected={selectedMetric === 'sales'}
        onClick={() => onMetricSelect('sales')}
      />
      <MetricCard
        title="CLIENTS SERVED"
        value="293"
        change="+3% since last month"
        selected={selectedMetric === 'clients'}
        onClick={() => onMetricSelect('clients')}
      />
      <MetricCard
        title="UTILIZATION"
        value="24%"
        change="+1% since last month"
        selected={selectedMetric === 'capacity'}
        onClick={() => onMetricSelect('capacity')}
      />
    </div>
  );
}