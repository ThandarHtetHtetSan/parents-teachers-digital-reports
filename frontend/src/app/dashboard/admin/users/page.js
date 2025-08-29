"use client";
import { useState, useEffect } from "react";

const roleOptions = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Principal" },
  { id: 3, name: "Teacher" },
  { id: 4, name: "Parent" },
];

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: 1,
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(roleOptions[0].id);

  // Fetch users from API
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter users by search and selected role
  const filteredUsers = users.filter(
    (u) =>
      (u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (selectedRole ? u.role_id === selectedRole : true)
  );

  const openAdd = () => {
    setEditingUser(null);
    setForm({ full_name: "", email: "", password: "", role_id: 1, status: "active" });
    setOpenModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ ...user, password: "" });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      // Update user
      await fetch(`http://127.0.0.1:5000/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // Create user
      await fetch("http://127.0.0.1:5000/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    // Refetch users
    fetch("http://127.0.0.1:5000/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      });
    setOpenModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
        >
          Add User
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-32 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {roleOptions.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-xs text-gray-500">ID</th>
                <th className="p-3 text-left text-xs text-gray-500">Full Name</th>
                <th className="p-3 text-left text-xs text-gray-500">Email</th>
                <th className="p-3 text-left text-xs text-gray-500">Role</th>
                <th className="p-3 text-left text-xs text-gray-500">Status</th>
                <th className="p-3 text-left text-xs text-gray-500">Created At</th>
                <th className="p-3 text-left text-xs text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{user.full_name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">
                    {roleOptions.find((r) => r.id === user.role_id)?.name || user.role_name}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{user.created_at}</td>
                  <td className="px-3 py-2">
                    <button
                      className="text-sky-600 hover:text-sky-700"
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
                >
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}