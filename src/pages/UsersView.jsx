import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/apiClient.js";
import Modal from "../components/Modal.jsx";
import { Plus, Search, Edit3, Trash2, CheckCircle } from "lucide-react";

const initialUsers = [];
const roles = ["admin", "user"];
const statuses = ["Active", "Invited", "Blocked"];

const normalizeUser = (user = {}) => ({
  id: user.userId || user.id || Date.now(),
  name: user.name || "",
  email: user.email || "",
  role: (user.role || "member").toLowerCase(),
  isActive: user.role === "Admin" ? "Active" : user.isActive,

  joined:
    user.joined || user.Joind || user.Joined
      ? new Date(user.joined || user.Joind || user.Joined).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        )
      : "",
  avatar:
    user.avatar ||
    "https://i.pravatar.cc/150?img=" + (Math.floor(Math.random() * 70) + 1),
});

export default function UsersView() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeUser, setActiveUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: "Invited",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/users");
      const normalized = (data.users || []).map(normalizeUser);
      console.log({ data });
      setUsers(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load users. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const { data } = await apiClient.get(`/users/${id}`);
      return normalizeUser(data.user || data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load user details.",
      );
      return null;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, users],
  );

  const openCreateModal = () => {
    setModalMode("create");
    setActiveUser(null);
    setFormValues({
      name: "",
      email: "",
      role: "user",
      isActive: "Invited",
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (user) => {
    setLoading(true);
    const userDetails = await fetchUserDetails(user.id);
    setLoading(false);

    if (!userDetails) return;

    setModalMode("edit");
    setActiveUser(userDetails);
    setFormValues({
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role,
      isActive: userDetails.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!formValues.name.trim() || !formValues.email.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (modalMode === "edit" && activeUser) {
        const { data } = await apiClient.put(`/users/${activeUser.id}`, {
          name: formValues.name,
          email: formValues.email,
          role: formValues.role,
          isActive: formValues.isActive,
        });

        const updatedUser = normalizeUser(
          data.user ||
            data || {
              ...activeUser,
              ...formValues,
            },
        );

        setUsers((prev) =>
          prev.map((user) =>
            user.id === activeUser.id ? { ...user, ...updatedUser } : user,
          ),
        );
      } else {
        const { data } = await apiClient.post("/users", {
          name: formValues.name,
          email: formValues.email,
          role: formValues.role,
          isActive: formValues.isActive,
        });

        const createdUser = normalizeUser(
          data.user ||
            data || {
              ...formValues,
              joined: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
        );

        setUsers((prev) => [createdUser, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save user. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    setError("");

    try {
      await apiClient.delete(`/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete user. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 p-6 overflow-hidden">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Organization</p>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Add, update, delete, and view users who belong to your organization.
            Use this screen to manage team members, assign roles, and keep track
            of account status.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, email or role..."
              className="input-base pl-10 w-full"
            />
          </div>

          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
            found
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize text-slate-700">
                      {user.role}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.isActive === "Invited"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        <CheckCircle className="mr-2 h-3.5 w-3.5" />
                        {user.isActive}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.joined}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(user)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "edit" ? "Edit user" : "Add user"}
        size="lg"
      >
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleFormChange}
                placeholder="Enter full name"
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                placeholder="Enter email"
                className="input-base w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formValues.role}
                onChange={handleFormChange}
                className="input-base w-full"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="isActive"
                value={formValues.isActive}
                onChange={handleFormChange}
                className="input-base w-full"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary py-3"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveUser}
              className="btn-primary py-3"
            >
              {modalMode === "edit" ? "Save Changes" : "Create User"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete user"
        size="sm"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete {userToDelete?.name}? This action
            cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="btn-primary py-2 px-4 bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
