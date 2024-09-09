import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

interface StonesProps {
  stones: number;
}

const Stone: React.FC<StonesProps> = ({ stones }: StonesProps) => {
  const stoneString = stones.toString();
  return (
    <React.Fragment>
      <div className="flex justify-between items-center relative mr-4">
        <div className="mr-[-2px] z-10">
          <Button size="icon" className="bg-yellow-700 w-[34px] h-[36px] mt-[2px] rounded-tl-[5px] rounded-bl-[5px]">
            <img src="/stone.svg" className="text-red-900" />
          </Button>
        </div>
        <div className="max-w-[115px] relative z-0">
          <Input value={stoneString} className="bg-yellow-700 h-[36px] border-none outline-none rounded-tr-[5px] rounded-br-[5px] max-w-[60px]" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Stone;
