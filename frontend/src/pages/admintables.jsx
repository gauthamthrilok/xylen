import { useState, useEffect } from "react";
import axios from "axios";

// Define the structure for your forms here.
const tableSchemas = {
  users: [
    { name: "username", type: "text" },
    { name: "password", type: "password", note: "(leave blank to keep old)" }
  ],
  products: [
    { name: "product_name", type: "text" },
    { name: "category", type: "text" },
    { name: "unit", type: "text" },
    { name: "unit_price", type: "number" },
    { name: "reorder_level", type: "number" }
  ],
  suppliers: [
    { name: "supplier_name", type: "text" },
    { name: "contact_info", type: "text" },
    { name: "address", type: "text" }
  ],
  customers: [
    { name: "customer_name", type: "text" },
    { name: "contact_info", type: "text" }
  ]
};

export default function Tables() {
  const [selectedTable, setSelectedTable] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const tables = ["users", "products", "suppliers", "customers", "transactions"];

  const fetchData = async () => {
    if (!selectedTable) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/${selectedTable}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const openForm = (mode, row = {}) => {
    setFormMode(mode);
    setFormData(mode === 'add' ? {} : row);
    setEditId(mode === "update" ? row[Object.keys(row)[0]] : null);
    setShowForm(true);
  };

  // FIXED: This function now correctly handles number types
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || null : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (!token) return console.error("No token found!");

      let dataToSend = { ...formData };
      if (selectedTable === "users" && formMode === "update" && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (formMode === "add") {
        await axios.post(`http://localhost:3000/${selectedTable}`, dataToSend, config);
      } else {
        await axios.put(`http://localhost:3000/${selectedTable}/${editId}`, dataToSend, config);
      }

      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (err) {
      // IMPORTANT: Check your browser console for errors from the backend!
      console.error("Error submitting form:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.delete(`http://localhost:3000/${selectedTable}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-10">
        <span className="text-[hsl(200,100%,70%)]">Welcome back</span> Admin
      </h2>

      {/* Dropdown Selector */}
      <div className="flex justify-center mb-8">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="px-6 py-3 rounded-xl text-black font-semibold shadow-md focus:ring-2 focus:ring-[hsl(200,100%,70%)]"
        >
          <option value="">-- Select a Table --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Add Button (hidden for transactions) */}
      {selectedTable && selectedTable !== "transactions" && (
        <div className="flex justify-end max-w-6xl mx-auto mb-4">
          <button
            onClick={() => openForm("add")}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
          >
            ➕ Add Record
          </button>
        </div>
      )}

      {/* Table Display */}
      {loading ? (
        <p className="text-center text-gray-400">Loading {selectedTable}...</p>
      ) : selectedTable && data.length > 0 ? (
        <div className="overflow-x-auto max-w-6xl mx-auto shadow-xl rounded-2xl bg-[#1e293b] border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#334155] text-[hsl(200,100%,70%)]">
                {Object.keys(data[0] || {}).map((col) => (
                  <th key={col} className="p-4 capitalize">{col.replace(/_/g, " ")}</th>
                ))}
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row[Object.keys(row)[0]]} className="border-b border-gray-700 hover:bg-[#2d3b52] transition-colors">
                  {Object.entries(row).map(([key, val]) => (
                    <td key={key} className="p-4">
                      {key.includes("password") ? "********" : (val !== null ? val.toString() : "—")}
                    </td>
                  ))}
                  <td className="p-4 space-x-2">
                    {selectedTable !== "transactions" && (
                      <button
                        onClick={() => openForm("update", row)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded-lg hover:scale-105 transition"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(row[Object.keys(row)[0]])}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:scale-105 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedTable ? (
        <p className="text-center text-gray-400">No records found.</p>
      ) : (
        <p className="text-center text-gray-400">Select a table to view data.</p>
      )}

      {/* Form Modal */}
      {showForm && selectedTable !== "transactions" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 capitalize">
              {formMode} {selectedTable.endsWith('s') ? selectedTable.slice(0, -1) : selectedTable} Record
            </h3>

            {(tableSchemas[selectedTable] || []).map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-sm mb-1 capitalize">
                  {field.name.replace("_", " ")}
                  {formMode === "update" && field.note && (
                    <span className="text-gray-400"> {field.note}</span>
                  )}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg text-black"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-500 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[hsl(200,100%,70%)] rounded-lg font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}