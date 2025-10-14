import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface OrderCardProps {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  total: number;
  image: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500 text-white" },
  processing: { label: "Processing", color: "bg-blue-500 text-white" },
  shipped: { label: "Shipped", color: "bg-purple-500 text-white" },
  delivered: { label: "Delivered", color: "bg-green-500 text-white" },
  cancelled: { label: "Cancelled", color: "bg-red-500 text-white" },
};

export function OrderCard({ id, orderNumber, date, status, items, total, image }: OrderCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img src={image} alt="Order" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold" data-testid={`text-order-number-${id}`}>Order #{orderNumber}</h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${id}`}>{date}</p>
            </div>
            <Badge className={statusInfo.color} data-testid={`badge-order-status-${id}`}>
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span data-testid={`text-order-items-${id}`}>{items} items</span>
            <span>•</span>
            <span className="font-semibold text-foreground" data-testid={`text-order-total-${id}`}>Total: ₹{total.toFixed(0)}</span>
          </div>

          <div className="flex gap-2">
            <Link href={`/orders/${id}`}>
              <Button variant="outline" size="sm" data-testid={`button-view-details-${id}`}>
                <Package className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            {status === "delivered" && (
              <Button variant="outline" size="sm" data-testid={`button-reorder-${id}`}>
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
