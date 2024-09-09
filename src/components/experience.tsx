import React from "react";
import { Progress } from "@/components/ui/progress";
import { FlaskConical } from "lucide-react"

interface ExpProps {
  experience: number;
  level: string;
}

const Exp: React.FC<ExpProps> = ({ experience, level }: ExpProps) => {
  return (
    <div className="flex flex-col items-center mt-[-5px] ml-10">
      <div className="relative flex flex-col items-center">
        <div className="absolute top-0 flex items-center justify-center w-full h-full">
          <FlaskConical className="z-10 text-green-600 mr-1 absolute left-[-32px] text-[60px]" />
          <span className="text-white font-bold z-10">{level}</span>
        </div>
        <Progress value={experience} className="w-[120px] h-[40px] rounded-[12px] border-none" />
      </div>
    </div>
  );
};

export default Exp;

