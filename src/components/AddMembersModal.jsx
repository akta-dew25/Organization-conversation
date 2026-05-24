import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slices/uiSlice.js";
import { addMemberToGroup } from "../redux/slices/groupsSlice";
import Modal from "./Modal";
import { Search, Check } from "lucide-react";

const AVAILABLE_USERS = [
  {
    id: 1,
    name: "Pooja Singh",
    email: "pooja@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Arun Sharma",
    email: "arun@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Jaskaran Singh",
    email: "jaskaran@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Ekta Patel",
    email: "ekta@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Nikhil Verma",
    email: "nikhil@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

export default function AddMembersModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modals.addMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const filteredUsers = AVAILABLE_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleMember = (user) => {
    setSelectedMembers((prev) =>
      prev.find((m) => m.id === user.id)
        ? prev.filter((m) => m.id !== user.id)
        : [...prev, user],
    );
  };

  const handleAddMembers = () => {
    selectedMembers.forEach((member) => {
      // dispatch(addMemberToGroup({ groupId, member }))
    });
    setSelectedMembers([]);
    dispatch(closeModal("addMembers"));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal("addMembers"))}
      title="Add Members"
      size="md"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-10 w-full"
          />
        </div>

        {/* Users List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => {
            const isSelected = selectedMembers.find((m) => m.id === user.id);
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => toggleMember(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Selected Count */}
        {selectedMembers.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              {selectedMembers.length} member
              {selectedMembers.length > 1 ? "s" : ""} selected
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal("addMembers"))}
            className="flex-1 btn-secondary py-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddMembers}
            disabled={selectedMembers.length === 0}
            className="flex-1 btn-primary py-2 disabled:opacity-50"
          >
            Add Members
          </button>
        </div>
      </div>
    </Modal>
  );
}
