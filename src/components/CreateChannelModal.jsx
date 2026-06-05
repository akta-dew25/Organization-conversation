import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slices/uiSlice.js";
import { addChannel, setChannels } from "../redux/slices/channelsSlice.js";
import { addGroup, setGroups } from "../redux/slices/groupsSlice.js";
import Modal from "./Modal.jsx";
import { Lock, Globe } from "lucide-react";
import authApi from "../api/authApi.js";
import chatApi from "../api/chatApi.js";
import { addPersonal, setPersonals } from "../redux/slices/personalSlice.js";

export default function CreateChannelModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modals.createChannel);
  const modalMeta = useSelector(
    (state) => state.ui.modalMeta.createChannel || {},
  );
  const currentUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacyType: "Public",
    groupType: modalMeta.groupType || "channel",
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const isFixedGroupType = Boolean(modalMeta.groupType);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        privacyType: "Public",
        groupType: modalMeta.groupType || "channel",
      });
      setSelectedMembers([]);
      setError("");
    }
  }, [isOpen, modalMeta.groupType]);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setUsersError("");
      setLoadingUsers(true);
      try {
        const { data } = await authApi.get("/users");
        const rawUsers = data?.users ?? data ?? [];
        const users = Array.isArray(rawUsers) ? rawUsers : [];

        const normalizedUsers = users.map((user) => ({
          ...user,
          userId: user?.userId ?? user?.id ?? user?._id,
          name: user?.name ?? user?.userName ?? user?.fullName ?? "Unknown",
          role: String(user?.role || "").toLowerCase(),
        }));

        const filteredUsers = normalizedUsers.filter(
          (user) =>
            user.userId &&
            user.userId !== currentUser?.userId &&
            user.role !== "admin",
        );

        if (mounted) setAvailableUsers(filteredUsers);
      } catch (err) {
        if (mounted) setUsersError(err.message || "Failed to load users");
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    };

    if (isOpen) fetchUsers();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const selectGroupType = (groupType) => {
    setFormData((prev) => ({
      ...prev,
      groupType,
    }));
    setSelectedMembers([]);
    setError("");
  };

  const toggleMember = (user) => {
    const userId = user.userId ?? user.id ?? user._id;
    const isSelected = selectedMembers.find(
      (member) =>
        String(member.userId ?? member.id ?? member._id) === String(userId),
    );

    if (isSelected) {
      setSelectedMembers((prev) =>
        prev.filter(
          (member) =>
            String(member.userId ?? member.id ?? member._id) !== String(userId),
        ),
      );
      return;
    }

    if (formData.groupType === "personal") {
      setSelectedMembers([user]);
      return;
    }

    setSelectedMembers((prev) => [...prev, user]);
  };

  const generateGroupName = () => {
    if (selectedMembers.length === 0) return "New group";
    return selectedMembers.map((member) => member.name).join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      if (formData.groupType === "personal") {
        if (selectedMembers.length !== 1) {
          setError("Personal chat requires exactly one other member.");
          return;
        }
      }

      if (formData.groupType === "group") {
        if (selectedMembers.length < 2) {
          setError("Group chat requires at least two members.");
          return;
        }
      }

      if (formData.groupType === "channel" && !formData.name.trim()) {
        setError("Channel name is required");
        return;
      }

      const currentUserId =
        currentUser?.userId || currentUser?.id || currentUser?._id;

      const selectedIds = selectedMembers.map(
        (member) => member.userId ?? member.id ?? member._id,
      );

      // Ensure the creator is included in members list so the other user
      // and the creator both see the personal/group chat in fetch endpoints.
      const membersIds = Array.from(new Set([currentUserId, ...selectedIds]));

      const payload = {
        groupType: formData.groupType.toLowerCase(),
        privacyType: formData.privacyType.toLowerCase(),
        name: formData.name,
        description: formData.description,
        membersIds,
      };

      /**
       * API CALL
       */

      const { data: res } = await chatApi.post("/chat-group", payload);

      const createGroup = res?.data;

      if (createGroup.data.groupType === "channel") {
        dispatch(addChannel(createGroup.data));
      }

      if (createGroup.data.groupType === "group") {
        dispatch(addGroup(createGroup.data));
      }

      if (createGroup.data.groupType === "personal") {
        dispatch(
          addPersonal({
            ...createGroup.data,
            name:
              createGroup.data.name ||
              selectedMembers[0]?.name ||
              currentUser?.name ||
              "Personal Chat",
          }),
        );
      }

      // CLOSE MODAL

      dispatch(closeModal("createChannel"));
    } catch (error) {
      console.log(error);

      setError(error?.response?.data?.message || "Failed to create chat group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal("createChannel"))}
      title={
        formData.groupType === "group"
          ? "Create Group"
          : formData.groupType === "personal"
            ? "Create Personal Chat"
            : "Create Channel"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* {!isFixedGroupType && (
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => selectGroupType("channel")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.groupType === "channel"
                  ? "border-primary bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold">Channel</p>
              <p className="text-xs text-gray-500 mt-1">
                Public or private channel
              </p>
            </button>
            <button
              type="button"
              onClick={() => selectGroupType("group")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.groupType === "group"
                  ? "border-primary bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold">Group</p>
              <p className="text-xs text-gray-500 mt-1">Team or project chat</p>
            </button>
            <button
              type="button"
              onClick={() => selectGroupType("personal")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.groupType === "personal"
                  ? "border-primary bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold">Personal</p>
              <p className="text-xs text-gray-500 mt-1">One-on-one chat</p>
            </button>
          </div>
        )} */}

        {formData.groupType !== "personal" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.groupType === "channel" ? "Channel Name" : "Group Name"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                formData.groupType === "channel"
                  ? "e.g. marketing-ideas"
                  : "e.g. Product Team"
              }
              className="input-base w-full"
              required={formData.groupType === "channel"}
            />
          </div>
        )}

        {(formData.groupType === "channel" ||
          formData.groupType === "group") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this chat about?"
              className="input-base w-full resize-none h-24"
            />
          </div>
        )}

        {(formData.groupType === "channel" ||
          formData.groupType === "group") && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  privacyType: "Public",
                }))
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.privacyType === "Public"
                  ? "border-primary bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Globe className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <p className="font-semibold text-sm">Public</p>
              <p className="text-xs text-gray-500">Everyone can join</p>
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  privacyType: "Private",
                }))
              }
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.privacyType === "Private"
                  ? "border-primary bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Lock className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <p className="font-semibold text-sm">Private</p>
              <p className="text-xs text-gray-500">Invite only</p>
            </button>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Members
            </label>
            <p className="text-xs text-gray-500">
              {formData.groupType === "personal"
                ? "Select 1 member"
                : "Select one or more members"}
            </p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-2">
            {loadingUsers ? (
              <div className="text-center text-sm text-gray-500 py-6">
                Loading users...
              </div>
            ) : usersError ? (
              <div className="text-sm text-red-500 p-3">{usersError}</div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                No users found
              </div>
            ) : (
              availableUsers.map((user) => {
                const isSelected = selectedMembers.some(
                  (member) => String(member.userId) === String(user.userId),
                );
                return (
                  <button
                    key={user.userId ?? user.id ?? user._id}
                    type="button"
                    onClick={() => toggleMember(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left border ${
                      isSelected
                        ? "border-primary bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={user.avatar || "https://i.pravatar.cc/150?img=1"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-primary font-semibold">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {selectedMembers.length > 0 && (
          <div className="p-3 rounded-lg bg-purple-50 text-sm text-purple-700">
            {selectedMembers.length} member
            {selectedMembers.length > 1 ? "s" : ""} selected.
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal("createChannel"))}
            className="flex-1 btn-secondary py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary py-2"
            disabled={loading ? true : false}
          >
            {loading ? "Creating..." : "Create"}
            {formData.groupType === "group"
              ? "Group"
              : formData.groupType === "personal"
                ? "Personal Chat"
                : "Channel"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
