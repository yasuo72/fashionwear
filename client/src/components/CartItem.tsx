import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  initialQuantity: number;
}

export function CartItem({ id, name, price, image, size, color, initialQuantity }: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeItem = () => {
    console.log(`Remove item ${id}`);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-2" data-testid={`text-cart-item-name-${id}`}>{name}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={removeItem}
              data-testid={`button-remove-${id}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-3">
            <span data-testid={`text-size-${id}`}>Size: {size}</span>
            <span className="mx-2">•</span>
            <span data-testid={`text-color-${id}`}>Color: {color}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={decreaseQuantity}
                data-testid={`button-decrease-${id}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium" data-testid={`text-quantity-${id}`}>{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={increaseQuantity}
                data-testid={`button-increase-${id}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-lg font-bold" data-testid={`text-total-${id}`}>
              ${(price * quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
