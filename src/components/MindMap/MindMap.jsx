import React, { useCallback, useState, useEffect, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    addEdge,
    MiniMap,
    useReactFlow,
    Handle,
} from "@xyflow/react";

import dagre from "dagre";
import "@xyflow/react/dist/style.css";

/**
 * MindMap with progressive single-branch expansion (NotebookLM style).
 *
 * Data shape expected:
 * {
 *   nodes: [{ id: '1', label: 'Root' }, { id: '2', label: 'Child' }, ...],
 *   edges: [{ source: '1', target: '2' }, ...]
 * }
 *
 * Behavior:
 * - Initially only root node visible.
 * - Clicking a node's expand button sets expandedPath to path(root -> node).
 * - Visible nodes are nodes along the expandedPath plus immediate children of each node in the path.
 * - Only one branch expands at a time (A mode).
 */

const nodeWidth = 200;
const nodeHeight = 60;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function applyLayout(nodes, edges, direction = "TB") {
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

/* Custom node renderer: shows label and expand/collapse button */
const ExpandableNode = ({ id, data }) => {
    // data: { label, hasChildren, isInPath, isExpanded, onToggle }
    const { label, hasChildren, isInPath, isExpanded, onToggle } = data;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                borderRadius: 10,
                background: isInPath ? "#304651" : "#1b2630",
                color: "#fff",
                minWidth: 160,
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
        >
            <div style={{ flex: 1, textAlign: "center", fontSize: 14 }}>{label}</div>

            {hasChildren && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle && onToggle(id);
                    }}
                    style={{
                        marginLeft: 8,
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        border: "none",
                        background: isExpanded ? "#2b6770" : "#2d3b46",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                    title={isExpanded ? "Collapse" : "Expand"}
                >
                    {isExpanded ? "‹" : "›"}
                </button>
            )}

            {/* invisible handles so React Flow can connect if needed */}
            <Handle type="target" position="left" style={{ background: "#999" }} />
            <Handle type="source" position="right" style={{ background: "#999" }} />
        </div>
    );
};

const MindMap = ({ data, fullscreen = false }) => {
    // full data lists (unchanged)
    const allNodes = data?.nodes || [];
    const allEdges = data?.edges || [];

    // parent / children maps
    const { childrenMap, parentMap, rootId } = useMemo(() => {
        const children = {};
        const parent = {};
        const ids = new Set(allNodes.map((n) => n.id.toString()));

        allEdges.forEach((e) => {
            const s = e.source.toString();
            const t = e.target.toString();
            if (!children[s]) children[s] = [];
            children[s].push(t);
            parent[t] = s;
        });

        // if root isn't provided, find node with no parent
        let root = null;
        for (const n of allNodes) {
            const id = n.id.toString();
            if (!parent[id]) {
                root = id;
                break;
            }
        }
        if (!root && allNodes.length) root = allNodes[0].id.toString();

        return { childrenMap: children, parentMap: parent, rootId: root };
    }, [allNodes, allEdges]);

    // expanded path from root -> current expanded node (array of ids)
    // initial: only root visible (path = [root])
    const [expandedPath, setExpandedPath] = useState(() => (rootId ? [rootId] : []));

    // synchronize root change
    useEffect(() => {
        if (!rootId) return;
        setExpandedPath([rootId]);
    }, [rootId]);

    // helper: build path from root to a node using parentMap
    const buildPathTo = useCallback(
        (nodeId) => {
            const p = [];
            let cur = nodeId;
            const seen = new Set();
            while (cur) {
                p.unshift(cur);
                seen.add(cur);
                cur = parentMap[cur];
                if (seen.has(cur)) break; // avoid cycles
            }
            // ensure path starts at root; if not, try to prepend root
            if (p[0] !== rootId) {
                // try to find path by walking up from node until a node with no parent
                // fallback: return [rootId]
                return [rootId];
            }
            return p;
        },
        [parentMap, rootId]
    );

    // toggle handler for node expand/collapse (single-branch behavior)
    const onToggleNode = useCallback(
        (nodeId) => {
            if (!nodeId) return;

            // if clicking the currently deepest expanded node => collapse it (pop)
            const last = expandedPath[expandedPath.length - 1];
            if (last === nodeId && expandedPath.length > 1) {
                setExpandedPath((prev) => prev.slice(0, prev.length - 1));
                return;
            }

            // otherwise set path to nodeId (root -> node)
            const newPath = buildPathTo(nodeId);
            setExpandedPath(newPath);
        },
        [expandedPath, buildPathTo]
    );

    // compute visible nodes: all nodes in expandedPath + immediate children of each path node
    const { visibleNodesRaw, visibleEdgesRaw } = useMemo(() => {
        const visibleSet = new Set();
        const edgesSet = new Set();

        if (!rootId) return { visibleNodesRaw: [], visibleEdgesRaw: [] };

        // always include nodes in expandedPath
        expandedPath.forEach((id) => visibleSet.add(id));

        // include immediate children for each node in path
        expandedPath.forEach((id) => {
            const children = childrenMap[id] || [];
            children.forEach((c) => visibleSet.add(c));
        });

        // also include root (defensive)
        visibleSet.add(rootId);

        // create node objects from allNodes
        const visibleNodes = allNodes
            .filter((n) => visibleSet.has(n.id.toString()))
            .map((n) => ({ ...n, id: n.id.toString() }));

        // include edges where both source & target are visible
        const visibleEdges = allEdges
            .filter((e) => visibleSet.has(e.source.toString()) && visibleSet.has(e.target.toString()))
            .map((e, i) => ({
                id: e.id || `edge-${e.source}-${e.target}-${i}`,
                source: e.source.toString(),
                target: e.target.toString(),
                type: "smoothstep",
            }));

        return { visibleNodesRaw: visibleNodes, visibleEdgesRaw: visibleEdges };
    }, [allNodes, allEdges, expandedPath, childrenMap, rootId]);

    // map nodes into react-flow nodes with custom node type and toggle handlers
    const reactFlowNodes = useMemo(() => {
        // create a set for quick checking which nodes are in the path
        const pathSet = new Set(expandedPath);

        return visibleNodesRaw.map((n) => {
            const id = n.id.toString();
            const hasChildren = (childrenMap[id] || []).length > 0;
            const isInPath = pathSet.has(id);
            const isExpanded = expandedPath[expandedPath.length - 1] === id || (isInPath && (childrenMap[id] || []).length > 0 && expandedPath.includes(id));
            return {
                id,
                type: "expandable", // custom node type
                data: {
                    label: n.label || n.title || `Node ${id}`,
                    hasChildren,
                    isInPath,
                    isExpanded: pathSet.has(id) && expandedPath.includes(id) && (expandedPath[expandedPath.length - 1] === id || childrenMap[id]?.length > 0),
                    onToggle: onToggleNode,
                },
                style: {
                    width: nodeWidth,
                    height: nodeHeight,
                },
            };
        });
    }, [visibleNodesRaw, expandedPath, childrenMap, onToggleNode]);

    const reactFlowEdges = useMemo(() => visibleEdgesRaw, [visibleEdgesRaw]);

    // layout nodes using Dagre whenever visible nodes/edges change
    const [layoutNodes, setLayoutNodes] = useState([]);
    const [layoutEdges, setLayoutEdges] = useState([]);

    useEffect(() => {
        const layouted = applyLayout(
            // dagre expects nodes with id
            reactFlowNodes.map((n) => ({
                id: n.id,
                // keep label in data so we can still display it in custom node
                data: n.data,
            })),
            reactFlowEdges,
            "TB" // Top -> Bottom layout (recommended to reduce vertical scrolling)
        );

        // merge layout positions back to node objects preserving type & data
        const merged = layouted.map((ln) => {
            const original = reactFlowNodes.find((r) => r.id === ln.id) || {};
            return {
                ...original,
                position: ln.position,
                targetPosition: ln.targetPosition,
                sourcePosition: ln.sourcePosition,
            };
        });

        setLayoutNodes(merged);
        setLayoutEdges(reactFlowEdges);
    }, [reactFlowNodes, reactFlowEdges]);

    // Fit view after layout changes or fullscreen changes
    // use useReactFlow().fitView — this hook must be used inside ReactFlow context,
    // and since this component renders ReactFlow below, it's safe to call it inside an effect
    // after the first render in which ReactFlow exists. We'll call fitView from an effect with timeout.
    // We will get the hook inside a nested effect by waiting for first render.
    // To be safe, we will attempt fitView via a try/catch.
    useEffect(() => {
        const t = setTimeout(() => {
            try {
                // There is a chance useReactFlow is not yet available; access via window React Flow viewport class fallback
                // Preferred: use the hook inside child components; but many setups below will work.
                // We'll try to call fitView by selecting the viewport and dispatching a resize - but primary is to call fitView if available
                // If the hook is available, it will run. We'll try to use a global approach too.
                const el = document.querySelector(".react-flow__viewport");
                // call fitView via a custom event processed by an inner component if hook not available
                // but we will try to call useReactFlow by creating a temporary custom event (no-op fallback)
                // Keep it simple: try to call window.__REACT_FLOW_FITVIEW__ if any consumer installed it.
                if (window.__REACT_FLOW_FITVIEW__) {
                    window.__REACT_FLOW_FITVIEW__({ padding: 0.2 });
                } else {
                    // try to dispatch a resize to force internal recalculation (helps React Flow)
                    if (el) {
                        window.dispatchEvent(new Event("resize"));
                    }
                }
            } catch (err) {
                // silent
            }
        }, 220);
        return () => clearTimeout(t);
    }, [layoutNodes, layoutEdges, fullscreen]);

    // ReactFlow custom nodeTypes registration
    const nodeTypes = useMemo(
        () => ({
            expandable: ExpandableNode,
        }),
        []
    );

    // onInit to capture instance and provide fitView via global (so we can call from outer effects)
    const onInit = useCallback((reactFlowInstance) => {
        try {
            // expose a small helper so the outer effect can call fitView safely
            window.__REACT_FLOW_FITVIEW__ = (opts = {}) => {
                try {
                    reactFlowInstance.fitView(opts);
                } catch { }
            };
        } catch { }
    }, []);

    const onConnect = useCallback((params) => {
        setLayoutEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds));
    }, []);

    return (
        <div style={{ width: "100%", height: fullscreen ? "100%" : "85vh" }}>
            <ReactFlow
                nodes={layoutNodes}
                edges={layoutEdges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                onInit={onInit}
                defaultEdgeOptions={{ animated: false, style: { strokeWidth: 2 } }}
                style={{ width: "100%", height: "100%" }}
            >
                <Background variant="dots" gap={25} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default MindMap;
