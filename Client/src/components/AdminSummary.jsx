import SummaryCard from "./SummaryCard";
import { TbUsers } from "react-icons/tb";
import { BsBuildings } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { LuCalendarDays } from "react-icons/lu";
import {
  FaRegCalendarCheck,
  FaRegCalendarPlus,
  FaRegCalendarXmark,
} from "react-icons/fa6";

const AdminSummary = () => {
  return (
    <>
      <div className="p-6 font-Grotesk">
        <h3 className="text-2xl font-bold">Dashboard Overview</h3>

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
          <SummaryCard
            icon={<TbUsers />}
            text="Total Employee"
            number={13}
            bgColor="bg-sky-500"
          />
          <SummaryCard
            icon={<BsBuildings />}
            text="Total Departments"
            number={5}
            bgColor="bg-teal-500"
          />
          <SummaryCard
            icon={<LiaRupeeSignSolid />}
            text="Monthly Payrolls"
            number="&#8377; 5000000"
            bgColor="bg-violet-500"
          />
        </div>
      </div>

      <div className="p-6 mt-12">
        <h4 className="text-2xl font-bold text-center">Leave Details</h4>

        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<LuCalendarDays />}
            text="Leave Balance"
            number={13}
            bgColor="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaRegCalendarPlus />}
            text="Leave Applied"
            number={5}
            bgColor="bg-orange-500"
          />
          <SummaryCard
            icon={<FaRegCalendarCheck />}
            text="Leave Approved"
            number={2}
            bgColor="bg-green-500"
          />
          <SummaryCard
            icon={<FaRegCalendarXmark />}
            text="Leave Rejected"
            number="3"
            bgColor="bg-red-500"
          />
        </div>
      </div>
    </>
  );
};

export default AdminSummary;
