import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { removeNotification } from "../redux/slices/uiSlice.js";

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.ui.notifications);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg text-white flex items-center justify-between gap-4 min-w-80 animate-in fade-in slide-in-from-bottom-2 ${
            notification.type === "error"
              ? "bg-red-500"
              : notification.type === "success"
                ? "bg-green-500"
                : notification.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
          }`}
        >
          <p>{notification.message}</p>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
