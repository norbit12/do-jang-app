"use client";
import { FiMoreVertical, FiPlus, FiLoader } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

type Item = {
  id: number;
  title: string;
  created_at: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);

  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");

  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editingItem, setEditingItem] = useState<{ id: number; title: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (window.innerWidth < 768) {
        setShowHeader(true);
        return;
      }

      if (currentY > 80) {
        if (currentY > lastScrollY) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("items")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    };

    fetchItems();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpenIndex !== null &&
        menuRefs.current[menuOpenIndex] &&
        !menuRefs.current[menuOpenIndex]?.contains(e.target as Node)
      ) {
        setMenuOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenIndex]);

  const addItem = async () => {
    if (!user || newItem.trim() === "") return;

    setIsAdding(true);

    const { data, error } = await supabase
      .from("items")
      .insert([
        {
          title: newItem.trim(),
          user_id: user.id,
        },
      ])
      .select("id, title, created_at");

    if (error) {
      console.error(error);
    } else if (data) {
      setItems([data[0], ...items]);
      setNewItem("");
      setOpen(false);
    }

    setIsAdding(false);
  };

  const removeItem = async (id: number) => {
    setDeletingId(id);

    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setItems(items.filter((item) => item.id !== id));
      setMenuOpenIndex(null);
    }

    setDeletingId(null);
  };

  const startEdit = (item: { id: number; title: string }) => {
    setEditingItem(item);
    setMenuOpenIndex(null);
  };

  const saveEdit = async () => {
    if (!editingItem) return;

    setIsEditing(true);

    const { data, error } = await supabase
      .from("items")
      .update({ title: editingItem.title })
      .eq("id", editingItem.id)
      .select("id, title, created_at");

    if (error) {
      console.error(error);
    } else if (data) {
      setItems(items.map((it) => (it.id === editingItem.id ? data[0] : it)));
      setEditingItem(null);
    }

    setIsEditing(false);
  };

  return (
    <div>
      <motion.div initial={{ y: 0 }} animate={{ y: showHeader ? 0 : "-100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="sticky top-0 z-50">
        <Header />
      </motion.div>

      <div className="md:max-w-md w-full md:mx-auto">
        <div className="flex flex-col space-y-4 px-4 md:px-0">
          {loading ? (
            <LoadingOverlay />
          ) : !user ? (
            <div className="pt-8 mb-16 flex flex-col items-center select-none">
              <p className="text-slate-400 text-lg font-semibold opacity-80">Log in to access posts.</p>
              <Image src="/cat.svg" alt="Cat" width={100} height={100} className="w-1/4 mt-4 opacity-30" />
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={item.id} className="px-4 py-3 bg-slate-50 rounded-md border border-slate-100 flex flex-col relative">
                <span className="text-sm mb-2 text-slate-400 block">{formatDistanceToNow(new Date(item.created_at), {addSuffix: true,})}</span>

                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.title}</ReactMarkdown>
                </div>

                <div className="absolute top-3 right-3" ref={(el) => {menuRefs.current[idx] = el;}}>
                  <button onClick={() => setMenuOpenIndex(menuOpenIndex === idx ? null : idx)} className="text-slate-400 outline-none focus-visible:ring-2 ring-slate-300 rounded-full">
                    <FiMoreVertical />
                  </button>

                  <div className={`absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-10 transform transition ${ menuOpenIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                    <button onClick={() => startEdit(item)} className="w-full text-left px-4 py-2 hover:bg-slate-100">
                      Edit
                    </button>

                    <button onClick={() => removeItem(item.id)} disabled={deletingId === item.id} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center">
                      {deletingId === item.id && (<FiLoader className="animate-spin mr-2" />)}Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {user && (<div className="w-full sticky bottom-0 bg-white py-4 px-4 md:px-0">
          <Button variant="secondary" disabled={!user} onClick={() => setOpen(true)} className="w-full" icon={<FiPlus className="text-slate-400" />}>Add a new item</Button>
        </div>)}
        <Footer />
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Item" value={newItem} onChange={setNewItem} onSubmit={addItem} loading={isAdding} submitLabel="Add" />
        <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Item" value={editingItem?.title || ""} onChange={(val) => setEditingItem((prev) => prev ? { ...prev, title: val } : prev)} onSubmit={saveEdit} loading={isEditing} submitLabel="Save" />
      </div>
    </div>
  );
}