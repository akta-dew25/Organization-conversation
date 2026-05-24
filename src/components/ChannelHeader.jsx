import { Info, Users } from "lucide-react";

export default function ChannelHeader({ channel }) {
  return (
    <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          #{channel?.name || "general"}
        </h2>
        <p className="text-sm text-gray-500">{channel?.description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Users className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
