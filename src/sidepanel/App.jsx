import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const defaultRule = {
  id: "",
  match: "",
  method: "GET",
  delay: 0,
  status: 200,
  headers: "{}",
  body: "{}",
  error: false,
};

const METHODS = ["GET", "POST", "PUT", "DELETE"];

export default function App() {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRule, setCurrentRule] = useState(defaultRule);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "sidepanel" });
    console.log("port", port);

    port.onMessage.addListener((msg) => {
      console.log("port msg", msg);
      if (msg.type === "LOG_MATCHED_REQUEST") {
        setLogs((prev) => [msg.log, ...prev.slice(0, 49)]);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["rules"], (res) => {
      setRules(res.rules || []);
    });
  }, []);

  const saveRules = (newRules) => {
    setRules(newRules);
    chrome.storage.local.set({ rules: newRules });
  };

  const handleDelete = (id) => {
    const updated = rules.filter((r) => r.id !== id);
    saveRules(updated);
  };

  const handleEdit = (rule) => {
    setCurrentRule(rule);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentRule({ ...defaultRule, id: uuidv4() });
    setShowModal(true);
  };

  const handleSave = () => {
    try {
      JSON.parse(currentRule.body);
      JSON.parse(currentRule.headers);
    } catch {
      alert("Headers or body is not valid JSON.");
      return;
    }

    const updated = rules.some((r) => r.id === currentRule.id)
      ? rules.map((r) => (r.id === currentRule.id ? currentRule : r))
      : [...rules, currentRule];

    saveRules(updated);
    setShowModal(false);
  };

  return (
    <div className="p-4 text-sm text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Mock Rules</h1>
        <button
          onClick={handleAdd}
          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          + Add Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <p className="text-gray-500">No rules added yet.</p>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 border rounded bg-white shadow">
              <div className="font-semibold text-blue-700">{rule.match}</div>
              <div className="text-xs text-gray-600">
                Method: <span className="font-medium">{rule.method}</span> |
                Delay: {rule.delay}ms | Status: {rule.status} | Error:{" "}
                {rule.error ? "Yes" : "No"}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(rule)}
                  className="px-2 py-1 text-xs bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-md font-bold mb-2 text-gray-700">Live Logs 🔥</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No intercepted requests yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className="p-2 border border-gray-300 rounded bg-gray-50 text-xs text-gray-800"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-blue-600">
                    {log.method}
                  </span>
                  <span className="text-gray-500">{log.time}</span>
                </div>
                <div className="break-all text-sm text-black">{log.url}</div>
                <div>
                  Status: {log.status} | Delay: {log.delay}ms
                </div>
                <div className="text-green-600">
                  Matched: ✅ (Rule #{log.ruleId?.slice(0, 6)})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-3">Rule Editor</h2>
            <div className="space-y-2">
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Regex Match URL"
                value={currentRule.match}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, match: e.target.value })
                }
              />
              <select
                className="w-full border px-2 py-1 rounded"
                value={currentRule.method}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, method: e.target.value })
                }
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                placeholder="Delay (ms)"
                value={currentRule.delay}
                onChange={(e) =>
                  setCurrentRule({
                    ...currentRule,
                    delay: Number(e.target.value),
                  })
                }
              />
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                placeholder="Status Code"
                value={currentRule.status}
                onChange={(e) =>
                  setCurrentRule({
                    ...currentRule,
                    status: Number(e.target.value),
                  })
                }
              />
              <textarea
                className="w-full border px-2 py-1 rounded"
                placeholder="Headers (JSON)"
                rows={2}
                value={currentRule.headers}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, headers: e.target.value })
                }
              />
              <textarea
                className="w-full border px-2 py-1 rounded"
                placeholder="Response Body (JSON)"
                rows={3}
                value={currentRule.body}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, body: e.target.value })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={currentRule.error}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, error: e.target.checked })
                  }
                />
                Simulate Error
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
