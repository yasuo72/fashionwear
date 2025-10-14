declare module 'razorpay' {
  interface RazorpayConfig {
    key_id: string;
    key_secret: string;
  }

  interface OrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture?: number;
  }

  interface Order {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
  }

  class Razorpay {
    constructor(config: RazorpayConfig);
    orders: {
      create(options: OrderOptions): Promise<Order>;
    };
  }

  export default Razorpay;
}
