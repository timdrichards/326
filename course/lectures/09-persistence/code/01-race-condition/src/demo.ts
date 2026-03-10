import { CartService } from "./cartService";

async function main(): Promise<void> {
  const service = new CartService();

  const tasks = Array.from({ length: 5 }, () => service.incrementWithRace());
  const results = await Promise.all(tasks);

  console.log("Results of concurrent increments:", results);
  console.log("Final quantity:", service.getQuantity());
  console.log("Expected quantity if no race existed:", tasks.length);
}

void main();
