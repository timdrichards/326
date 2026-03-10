export type CartRecord = { quantity: number };

export class CartService {
  private state: CartRecord = { quantity: 0 };

  async incrementWithRace(): Promise<number> {
    const current = this.state.quantity;
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.state.quantity = current + 1;
    return this.state.quantity;
  }

  getQuantity(): number {
    return this.state.quantity;
  }
}
