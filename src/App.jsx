import React, { useState } from "react";

function App() {
  const [entries, setEntries] = useState([{ name: "", time: "" }]);
  const [copied, setCopied] = useState(false);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { name: "", time: "" }]);
  };

  const getResult = () => {
    const validEntries = entries.filter((e) => e.name && e.time !== "");
    if (validEntries.length === 0) return "";

    const sorted = [...validEntries].sort(
      (a, b) => Number(b.time) - Number(a.time)
    );

    const maxTime = Number(sorted[0].time);

    return sorted
      .map((e) => `${e.name} ${maxTime - Number(e.time)}`)
      .join("\n");
  };

  const handleCopy = () => {
    const text = getResult();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒で消える
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>コピーボタン横に通知</h2>

      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="名前"
            value={entry.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="number"
            placeholder="秒数"
            value={entry.time}
            onChange={(e) => handleChange(index, "time", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addEntry}>行を追加</button>

      <h3>結果（コピペ用）</h3>
      <textarea
        readOnly
        value={getResult()}
        style={{ width: "100%", height: "150px" }}
      />

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
        <button onClick={handleCopy}>コピーする</button>
        {copied && (
          <span style={{ marginLeft: "10px", color: "green" }}>
            ✅ コピーしました！
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
