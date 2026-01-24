"use client";
import Button from "./Button";
import { FiLoader } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    submitLabel?: string;
    }

    export default function Modal({
    isOpen,
    onClose,
    title,
    value,
    onChange,
    onSubmit,
    loading = false,
    submitLabel = "Save",
    }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/4">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={7}
            placeholder="Enter text..."
            className="w-full border rounded-md px-4 py-2 mb-4 border-slate-200 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-4 ring-slate-200 duration-200"
            />
            <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading} icon={loading ? <FiLoader className="animate-spin" /> : undefined}>
                {submitLabel}
            </Button>
            </div>
        </div>
        </div>
    );
}