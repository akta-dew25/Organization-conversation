import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "../redux/slices/uiSlice.js";
import { addChannel } from "../redux/slices/channelsSlice.js";
import Modal from "./Modal.jsx";
import { Lock, Globe } from "lucide-react";

export default function CreateChannelModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modals.createChannel);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    private: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newChannel = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      icon: formData.private ? "lock" : "#",
      private: formData.private,
    };

    dispatch(addChannel(newChannel));
    setFormData({ name: "", description: "", private: false });
    dispatch(closeModal("createChannel"));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal("createChannel"))}
      title="Create Channel"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Channel Type */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                private: false,
              }))
            }
            className={`p-4 rounded-lg border-2 transition-all ${
              !formData.private
                ? "border-primary bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Globe className="w-6 h-6 mx-auto mb-2 text-gray-700" />
            <p className="font-semibold text-sm">Public</p>
            <p className="text-xs text-gray-500">Everyone can see</p>
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                private: true,
              }))
            }
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.private
                ? "border-primary bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Lock className="w-6 h-6 mx-auto mb-2 text-gray-700" />
            <p className="font-semibold text-sm">Private</p>
            <p className="text-xs text-gray-500">Invite only</p>
          </button>
        </div>

        {/* Channel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. marketing-ideas"
            className="input-base w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What is this channel about?"
            className="input-base w-full resize-none h-24"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal("createChannel"))}
            className="flex-1 btn-secondary py-2"
          >
            Cancel
          </button>
          <button type="submit" className="flex-1 btn-primary py-2">
            Create Channel
          </button>
        </div>
      </form>
    </Modal>
  );
}
