import React, { useState } from "react";

function App() {
  // 開始時間（時・分・秒）
  const [startTime, setStartTime] = useState({
    hour: "",
    minute: "",
    second: "",
  });

  // 名前と秒数のリスト
  const [entries, setEntries] = useState([{ name: "", time: "" }]);

  // コピー完了メッセージ用
  const [copied, setCopied] = useState(false);

  // 入力更新
  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  // 行追加
  const addEntry = () => {
    setEntries([...entries, { name: "", time: "" }]);
  };

  // 結果を生成する関数
  const getResult = () => {
    const validEntries = entries.filter((e) => e.name && e.time !== "");
    if (validEntries.length === 0) return "";

    const sorted = [...validEntries].sort(
      (a, b) => Number(b.time) - Number(a.time)
    );

    const baseSeconds =
      Number(startTime.hour || 0) * 3600 +
      Number(startTime.minute || 0) * 60 +
      Number(startTime.second || 0);

    const maxTime = Number(sorted[0].time);

    return sorted
      .map((e) => {
        const diff = maxTime - Number(e.time);
        const totalSeconds = baseSeconds + diff;

        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const s = String(totalSeconds % 60).padStart(2, "0");

        return `${e.name}: ${h}:${m}:${s}`;
      })
      .join("\n");
  };

  // コピー処理
  const handleCopy = () => {
    const text = getResult();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>集結時間自動計算ツール</h2>

      {/* 開始時間の入力 */}
      <div style={{ marginBottom: "20px" }}>
        <label>開始時間：</label>
        <input
          type="number"
          placeholder="時"
          min={0}
          max={23}
          value={startTime.hour}
          onChange={(e) => setStartTime({ ...startTime, hour: e.target.value })}
          style={{ width: "60px", margin: "0 5px" }}
        />
        :
        <input
          type="number"
          placeholder="分"
          min={0}
          max={59}
          value={startTime.minute}
          onChange={(e) =>
            setStartTime({ ...startTime, minute: e.target.value })
          }
          style={{ width: "60px", margin: "0 5px" }}
        />
        :
        <input
          type="number"
          placeholder="秒"
          min={0}
          max={59}
          value={startTime.second}
          onChange={(e) =>
            setStartTime({ ...startTime, second: e.target.value })
          }
          style={{ width: "60px", margin: "0 5px" }}
        />
      </div>

      {/* 名前と秒数の入力 */}
      <h3>集結者と行軍時間</h3>
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
      <button onClick={addEntry}>＋ 行を追加</button>

      {/* 結果表示 */}
      <h3 style={{ marginTop: "20px" }}>結果（コピペ用）</h3>
      <textarea
        readOnly
        value={getResult()}
        style={{ width: "100%", height: "150px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleCopy}>コピーする</button>
        {copied && <span style={{ marginLeft: "10px", color: "green" }}>✅ コピーしました！</span>}
      </div>
    </div>
  );
}

export default App;
