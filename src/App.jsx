import { useState } from "react";
import ReactFlow, { addEdge, Controls } from "reactflow";
import "reactflow/dist/style.css";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);

  // ✅ Add node (clean spacing)
  const addNode = (type) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      position: {
        x: nodes.length * 200 + 50,
        y: 200,
      },
      data: {
        label: type,
        title: "",
        assignee: "",
        role: "",
        action: "",
        message: "",
      },
    };

    setNodes([...nodes, newNode]);
  };

  // ✅ Connect nodes
  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  };

  // ✅ Update fields
  const updateNodeField = (field, value) => {
    const updated = nodes.map((n) =>
      n.id === selectedNode.id
        ? {
            ...n,
            data: {
              ...n.data,
              [field]: value,
              label: field === "title" ? value : n.data.label,
            },
          }
        : n
    );

    setNodes(updated);
    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, [field]: value },
    });
  };

  // ✅ Run workflow (simple ordered execution)
  const runWorkflow = () => {
    const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);

    const result = sorted.map((node, i) => {
      let text = `Step ${i + 1}: ${node.type}`;

      if (node.type === "Task")
        text += ` (Assignee: ${node.data.assignee || "None"})`;

      if (node.type === "Approval")
        text += ` (Role: ${node.data.role || "None"})`;

      if (node.type === "Automated")
        text += ` (Action: ${node.data.action || "None"})`;

      if (node.type === "End")
        text += ` (Message: ${node.data.message || "Done"})`;

      return text;
    });

    setLogs(result);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div style={{ flex: 3 }}>
        <h2 style={{ textAlign: "center" }}>HR Workflow Designer</h2>

        {/* Buttons */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <button onClick={() => addNode("Start")}>Start</button>
          <button onClick={() => addNode("Task")}>Task</button>
          <button onClick={() => addNode("Approval")}>Approval</button>
          <button onClick={() => addNode("Automated")}>Automated</button>
          <button onClick={() => addNode("End")}>End</button>
          <button onClick={runWorkflow} style={{ marginLeft: 10 }}>
            Run Workflow
          </button>
        </div>

        {/* Canvas */}
        <div style={{ height: "60%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={(e, node) => setSelectedNode(node)}
          >
            <Controls />
          </ReactFlow>
        </div>

        {/* OUTPUT */}
        <div style={{ padding: 10 }}>
          <h3>Output</h3>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          background: "#f4f4f4",
          padding: 20,
          borderLeft: "2px solid #ccc",
        }}
      >
        <h3>Edit Node</h3>

        {selectedNode ? (
          <>
            <input
              placeholder="Title"
              value={selectedNode.data.title}
              onChange={(e) =>
                updateNodeField("title", e.target.value)
              }
            />

            <br /><br />

            {selectedNode.type === "Task" && (
              <input
                placeholder="Assignee"
                value={selectedNode.data.assignee}
                onChange={(e) =>
                  updateNodeField("assignee", e.target.value)
                }
              />
            )}

            {selectedNode.type === "Approval" && (
              <input
                placeholder="Role"
                value={selectedNode.data.role}
                onChange={(e) =>
                  updateNodeField("role", e.target.value)
                }
              />
            )}

            {selectedNode.type === "End" && (
              <input
                placeholder="Message"
                value={selectedNode.data.message}
                onChange={(e) =>
                  updateNodeField("message", e.target.value)
                }
              />
            )}
          </>
        ) : (
          <p>Select a node</p>
        )}
      </div>
    </div>
  );
}

export default App;