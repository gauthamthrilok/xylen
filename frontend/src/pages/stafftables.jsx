import { useState, useEffect } from "react";
import axios from "axios";

// Create and configure the axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define the structure for your forms
const tableSchemas = {
  products: [
    { name: "product_name", type: "text", placeholder: "e.g., Coffee Beans" },
    { name: "category", type: "text", placeholder: "e.g., Beverages" },
    { name: "unit", type: "text", placeholder: "e.g., kg" },
    { name: "unit_price", type: "number", placeholder: "e.g., 200.00" },
    { name: "reorder_level", type: "number", placeholder: "e.g., 10" },
  ],
  transactions: [
    { name: "product_id", type: "number", placeholder: "ID of the product" },
    // CHANGED: This is now a dropdown to ensure valid input
    { 
      name: "transaction_type", 
      type: "select", 
      options: ["IN", "OUT"] 
    },
    { name: "quantity", type: "number", placeholder: "e.g., 50" },
    { name: "supplier_id", type: "number", placeholder: "ID for 'IN' type" },
    { name: "customer_id", type: "number", placeholder: "ID for 'OUT' type" },
  ],
};

export default function StaffTables() {
  const [data, setData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const tables = ["products", "transactions"];

  // Fetch data for the main table when `selectedTable` changes
  useEffect(() => {
    if (selectedTable) {
      setLoading(true);
      api.get(`/${selectedTable}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("Error fetching data:", err.response || err))
        .finally(() => setLoading(false));
    } else {
      setData([]);
    }
  }, [selectedTable]);

  const openForm = (mode, row = {}) => {
    setFormMode(mode);
    setFormData(mode === 'add' ? {} : row);
    setEditId(mode === "update" ? row[Object.keys(row)[0]] : null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || null : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formMode === "add") {
        await api.post(`/${selectedTable}`, formData);
      } else {
        await api.put(`/${selectedTable}/${editId}`, formData);
      }
      setShowForm(false);
      setFormData({});
      if (selectedTable) {
        setLoading(true);
        const res = await api.get(`/${selectedTable}`);
        setData(res.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${selectedTable}/${id}`);
      const res = await api.get(`/${selectedTable}`);
      setData(res.data);
    } catch (err) {
      console.error("Error deleting record:", err.response || err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-10">
        <span className="text-[hsl(200,100%,70%)]">Welcome back</span> Staff
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
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end max-w-6xl mx-auto mb-4">
        <button
          onClick={() => openForm("add")}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
        >
          ➕ Add Record
        </button>
      </div>

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
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="p-4">{val !== null ? val.toString() : "—"}</td>
                  ))}
                  <td className="p-4 space-x-2">
                    {selectedTable !== "transactions" && (
                      <button onClick={() => openForm("update", row)} className="px-3 py-1 bg-yellow-500 text-black rounded-lg hover:scale-105 transition">Update</button>
                    )}
                    <button onClick={() => handleDelete(row[Object.keys(row)[0]])} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:scale-105 transition">Delete</button>
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
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 capitalize">
              {formMode} {selectedTable.endsWith('s') ? selectedTable.slice(0, -1) : selectedTable} Record
            </h3>
            
            {(tableSchemas[selectedTable] || []).map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-sm mb-1 capitalize">{field.name.replace("_", " ")}</label>
                {/* CHANGED: Conditionally render a dropdown for the transaction_type field */}
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg text-black"
                  >
                    <option value="">-- Select Type --</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    className="w-full px-3 py-2 rounded-lg text-black"
                  />
                )}
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