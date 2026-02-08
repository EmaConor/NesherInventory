import { currencyFormat } from "@/utils";
import {
  IconAlertTriangle,
  IconCurrencyDollar,
  IconPackage,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";

interface Props {
  stats: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalInventoryValue: number;
    totalProfit: number;
  };
}

export const Stats = ({ stats }: Props) => {
  const cards = [
    {
      title: "Total Productos",
      value: stats.totalProducts.toString(),
      icon: IconPackage,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Bajo Stock",
      value: stats.lowStockCount.toString(),
      icon: IconAlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Agotados",
      value: stats.outOfStockCount.toString(),
      icon: IconX,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Valor Inventario",
      value: `${currencyFormat(stats.totalInventoryValue)}`,
      icon: IconCurrencyDollar,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Ganancia Potencial",
      value: `${currencyFormat(stats.totalProfit)}`,
      icon: IconTrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];
  return (
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {card.title}
                </p>
                <p className="text-lg font-semibold truncate">{card.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
