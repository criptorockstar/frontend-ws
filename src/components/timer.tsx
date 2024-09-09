import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

interface TimerProps {
  timer: any;
}

const Timer: React.FC<TimerProps> = ({ timer }: TimerProps) => {
  const timerString = timer.toString();
  return (
    <React.Fragment>
      <div className="flex justify-between items-center relative ml-4 mt-[-5px]">
        <div className="ml-1">
          <Button size="icon" className="bg-yellow-700 w-[34px] h-[36px] mt-[2px] rounded-tl-[5px] rounded-bl-[5px]">
            <img src="/clock.svg" className="text-red-900" />
          </Button>
        </div>
        <div className="max-w-[115px] relative z-0">
          <Input value={timerString} className="bg-yellow-700 pl-[3px] h-[36px] border-none outline-none rounded-tr-[5px] rounded-br-[5px] max-w-[60px]" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Timer;
