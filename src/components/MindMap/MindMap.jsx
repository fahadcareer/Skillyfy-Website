import React, { useCallback, useState, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    addEdge,
    MiniMap,
} from "@xyflow/react";

import dagre from "dagre";
import "@xyflow/react/dist/style.css";

const nodeWidth = 200;
const nodeHeight = 60;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function applyLayout(nodes, edges, direction = "LR") {
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
        const pos = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: pos.x - nodeWidth / 2,
                y: pos.y - nodeHeight / 2,
            },
            targetPosition: "left",
            sourcePosition: "right",
        };
    });
}

const MindMap = ({ data }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        if (!data?.nodes || !data?.edges) return;

        const formattedNodes = data.nodes.map((node) => ({
            id: node.id.toString(),
            data: { label: node.label || node.title || "Node" },
            ...node,
            style: {
                padding: 14,
                borderRadius: 12,
                background: "#0F3D3E",
                color: "white",
                fontSize: 13,
                width: 200,
                textAlign: "center",
            },
        }));

        const formattedEdges = data.edges.map((e, i) => ({
            id: e.id || `edge-${i}`,
            source: e.source.toString(),
            target: e.target.toString(),
            type: "smoothstep",
        }));

        const layoutedNodes = applyLayout(formattedNodes, formattedEdges);

        setNodes(layoutedNodes);
        setEdges(formattedEdges);
    }, [data]);

    const onConnect = useCallback(
        (params) => setEdges((eds) =>
            addEdge({ ...params, type: "smoothstep" }, eds)
        ),
        []
    );

    return (
        <div style={{ width: "100%", height: "85vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={{ animated: false, style: { strokeWidth: 2 } }}
            >
                <Background variant="dots" gap={25} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default MindMap;
