import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function TreeNode({ label, children }) {
    const [open, setOpen] = useState(true);

    const hasChildren =
        children &&
        typeof children === "object" &&
        !Array.isArray(children) &&
        Object.keys(children).length > 0;

    return (
        <div className="ml-4 mt-1">
            <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => hasChildren && setOpen(!open)}
            >
                {hasChildren ? (
                    open ? (
                        <ChevronDown size={16} className="text-gray-600" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-600" />
                    )
                ) : (
                    <span className="ml-[18px]"></span>
                )}

                <span className="font-medium text-gray-800">{label}</span>
            </div>

            {open && hasChildren && (
                <div className="ml-6 border-l pl-4 mt-1">
                    {Object.entries(children).map(([childLabel, childValue], i) => (
                        <TreeNode key={i} label={childLabel} children={childValue} />
                    ))}
                </div>
            )}
        </div>
    );
}
