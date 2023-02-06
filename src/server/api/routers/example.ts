import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { spawn } from "child_process";

const getBestMove = () => {
  return new Promise<string>((resolve) => {
    const stockfish = spawn("vendor/Stockfish/src/stockfish");
    stockfish.stdout.on("data", (data: Buffer) => {
      console.log(data.toString());
      stockfish.stdin.write("quit\n");
      resolve(data.toString());
    });
  });
};

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      return {
        greeting: `Hello ${await getBestMove()}`,
      };
    }),
});
