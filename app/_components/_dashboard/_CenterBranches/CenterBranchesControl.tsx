"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Branch } from "./types";
import { instance } from "@/app/_helpers/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "./Modal";
import { BranchForm } from "./BranchForm";
import ConfirmDeletePopup from "../_dynamicComponents/ConfirmDeletePopup";
import { toast } from "sonner";

interface props {
  branchesData: Branch[];
}

export default function CenterBranchesControl({ branchesData }: props) {
  const [branches, setBranches] = useState<Branch[]>(branchesData ?? []);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showConfrim, setShowConfrim] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const createBranch = async (payload: {
    title: string;
    email: string;
    phone: string;
    location: any;
  }) => {
    try {
      setFormLoading(true);
      const res = await instance.post("/create-branche", payload);
      if (res.status == 201) {
        setBranches((prev) => [res.data.data, ...prev]);
        setShowCreate(false);
        toast.success("تم اضافة الفرع الجديد الى القائمة بنجاح");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Create failed");
    } finally {
      setFormLoading(false);
    }
  };

  const updateBranch = async (payload: {
    title: string;
    email: string;
    phone: string;
    location: any;
  }) => {
    if (!editing) return;
    try {
      setFormLoading(true);
      const res = await instance.post(`/update-branche/${editing.id}`, payload);
      if (res.status == 200) {
        setBranches((prev) =>
          prev.map((b) => (b.id === editing.id ? res.data.data : b))
        );
        toast.success("تم تحديث بيانات الفرع المجدد بنجاح");
      }
      setShowEditModal(false);
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteBranch = async () => {
    setDeletingId(selectedBranch?.id as number);
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/delete-branche/${selectedBranch?.id}`
      );
      if (response.status == 200) {
        setBranches((prev) => prev.filter((b) => b.id !== selectedBranch?.id));
        handleClose();
        toast.success("تم حذف بيانات الفرع بنجاح");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (b: Branch) => {
    setSelectedBranch(b);
    setShowConfrim(true);
  };

  const handleClose = () => {
    setSelectedBranch(null);
    setShowConfrim(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold pb-2 border-b border-primary">
          الفروع
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreate(true)}>
            <FiPlus className="inline mr-2" /> فرع جديد
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {branches.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="px-3 h-full">
                <h1 className="w-full pb-2 border-b border-gray-300">
                  {b?.title ?? ""}
                </h1>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {b.location.address || `Branch #${b.id}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {b.email} • {b.phone}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(b.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(b);
                        setShowEditModal(true);
                      }}
                      className="px-2 py-1 rounded hover:bg-gray-100"
                      aria-label="edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(b)}
                      className="px-2 py-1 rounded hover:bg-gray-100 text-red-600"
                      aria-label="delete"
                    >
                      {deletingId === b.id ? "Deleting..." : <FiTrash2 />}
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create modal */}
      <Modal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        title="اضافة فرع جديد"
      >
        <BranchForm
          onCancel={() => setShowCreate(false)}
          onSubmit={createBranch}
          formLoading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditing(null);
        }}
        title="تعديل بيانات الفرع"
      >
        {editing && (
          <BranchForm
            initial={editing}
            onCancel={() => {
              setShowEditModal(false);
              setEditing(null);
            }}
            onSubmit={updateBranch}
            formLoading={formLoading}
          />
        )}
      </Modal>

      <ConfirmDeletePopup
        id={selectedBranch?.id as number}
        onClose={handleClose}
        onDelete={deleteBranch}
        showConfirm={showConfrim}
        title={`الفرع ذو رقم الهاتف -${selectedBranch?.phone}`}
        loading={deleteLoading}
      />

      {loading && <div className="mt-4 text-sm text-gray-600">Loading...</div>}
    </div>
  );
}
