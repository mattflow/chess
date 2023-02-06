import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { spawn } from "child_process";
import path from "path";
import { promises as fs } from "fs";

const getBestMove = () => {
  return new Promise<string>((resolve) => {
    const stockfishPath = path.join(
      process.cwd(),
      "vendor/Stockfish/src/stockfish"
    );
    const stockfish = spawn(stockfishPath);
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
