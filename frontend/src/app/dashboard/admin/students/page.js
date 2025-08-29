"use client";
import { useState, useEffect } from "react";

export default function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    student_code: "",
    class_id: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch classes and parents for dropdowns
  useEffect(() => {
    fetch("http://127.0.0.1:5000/classes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setClasses(data.classes);
      });
    fetch("http://127.0.0.1:5000/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setParents(data.users.filter((u) => u.role_id === 4));
      });
  }, []);

  // Fetch students from API
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/admin/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudents(data.students);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter students by search and class
  const filteredStudents = students.filter(
    (s) =>
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.student_code.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedClass || String(s.class_id) === String(selectedClass))
  );

  const openAdd = () => {
    setEditingStudent(null);
    setForm({
      name: "",
      student_code: "",
      class_id: classes[0]?.id || "",
      user_id: parents[0]?.id || "",
    });
    setOpenModal(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setForm({ ...student });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      // Update student
      await fetch(`http://127.0.0.1:5000/admin/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // Create student
      await fetch("http://127.0.0.1:5000/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    // Refetch students
    fetch("http://127.0.0.1:5000/admin/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudents(data.students);
      });
    setOpenModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
        >
          Add Student
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-32 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-xs text-gray-500">ID</th>
                <th className="p-3 text-left text-xs text-gray-500">Student Name</th>
                <th className="p-3 text-left text-xs text-gray-500">Student Code</th>
                <th className="p-3 text-left text-xs text-gray-500">Class</th>
                <th className="p-3 text-left text-xs text-gray-500">Parent</th>
                <th className="p-3 text-left text-xs text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.student_code}</td>
                  <td className="px-3 py-2">
                    {classes.find((c) => String(c.id) === String(student.class_id))?.name}
                  </td>
                  <td className="px-3 py-2">
                    {parents.find((p) => String(p.id) === String(student.user_id))?.full_name}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="text-sky-600 hover:text-sky-700"
                      onClick={() => openEdit(student)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No students found.
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
              {editingStudent ? "Edit Student" : "Add Student"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Code
                </label>
                <input
                  type="text"
                  name="student_code"
                  value={form.student_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class_id"
                  value={form.class_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent
                </label>
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">Select Parent</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.full_name}
                    </option>
                  ))}
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
                  {editingStudent ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}