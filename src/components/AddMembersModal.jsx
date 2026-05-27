import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { closeModal } from "../redux/slices/uiSlice";
import authApi from "../api/authApi.js";
import chatApi from "../api/chatApi.js";

export default function AddMemberModal() {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.ui.modals.addMember);

  const modalMeta = useSelector((state) => state.ui.modalMeta.addMember || {});

  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await authApi.get("/users");

        setUsers(data?.users || data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const toggleMember = (user) => {
    const exists = selectedMembers.find((item) => item.userId === user.userId);

    if (exists) {
      setSelectedMembers((prev) =>
        prev.filter((item) => item.userId !== user.userId),
      );
    } else {
      setSelectedMembers((prev) => [...prev, user]);
    }
  };

  const handleAddMembers = async () => {
    try {
      setLoading(true);

      const payload = {
        members: selectedMembers.map((member) => ({
          userName: member.name,
          userId: member.userId,
        })),
      };

      await chatApi.patch(
        `/chat-group/${modalMeta.groupId}/add-members`,
        payload,
      );

      /**
       * REFRESH GROUP DATA
       */
      if (modalMeta?.refreshGroup) {
        await modalMeta.refreshGroup();
      }

      setSelectedMembers([]);

      dispatch(closeModal("addMember"));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal("addMember"))}
      title="Add Members"
      size="lg"
    >
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {users.map((user) => {
          const isSelected = selectedMembers.some(
            (member) => member.userId === user.userId,
          );

          return (
            <button
              key={user.userId}
              onClick={() => toggleMember(user)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1 text-left">
                <p className="font-medium text-gray-800">{user.name}</p>

                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {isSelected && (
                <span className="text-purple-600 font-semibold">Selected</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => dispatch(closeModal("addMember"))}
          className="flex-1 py-2 rounded-lg border border-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleAddMembers}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Members"}
        </button>
      </div>
    </Modal>
  );
}
