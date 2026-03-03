'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../../components/sidebar";
import NavbarUser from "../../../components/navbaruser";
import axios from "axios";
import { User, Mail, Phone, MessageSquare, MapPin, Pencil, Check, X, Loader2, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
export default function Information() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  
  // State สำหรับ Modal เปลี่ยนรหัสผ่าน (เผื่อคุณนำไปใช้ทำต่อ)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editMode, setEditMode] = useState<Record<string, boolean>>({
    name: false, email: false, phone: false, lineid: false, address: false
  });

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", lineid: "", address: ""
  });

  const fetchUser = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const response = await axios.get(`/api/user/${session.user.email}`);
      setUserData(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        lineid: response.data.lineid || "",
        address: response.data.address || ""
      });
    } catch (err) {
      console.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    } else if (status === "authenticated") {
      fetchUser();
    }
  }, [status, fetchUser, router]);

  const handleEditClick = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setFormData(prev => ({ ...prev, [field]: userData[field] || "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field: string) => {
    if (!session?.user?.email) return;
    setSavingField(field);
    try {
      await axios.put(`/api/user/${session.user.email}`, {
        [field]: formData[field as keyof typeof formData]
      });
      setUserData((prev: any) => ({
        ...prev,
        [field]: formData[field as keyof typeof formData]
      }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      if (field === "email") router.replace("/user/login");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSavingField(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const getIcon = (field: string) => {
    switch (field) {
      case 'name': return <User size={20} />;
      case 'email': return <Mail size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'lineid': return <MessageSquare size={20} />;
      case 'address': return <MapPin size={20} />;
      default: return null;
    }
  };

  const getLabel = (field: string) => {
    switch (field) {
      case 'name': return 'ชื่อ-นามสกุล';
      case 'email': return 'อีเมลติดต่อ';
      case 'phone': return 'เบอร์โทรศัพท์';
      case 'lineid': return 'Line ID';
      case 'address': return 'ที่อยู่สำหรับการจัดส่ง';
      default: return field;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarUser />

      {/* ปรับ Grid เป็น 10 ส่วนตามที่ตกลงกัน เพื่อให้ Sidebar กว้างขึ้น */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          
          {/* Sidebar Area - กว้างขึ้นเป็น 3 ส่วน */}
          <div className="lg:col-span-3">
             <div className="lg:sticky lg:top-8">
                <Sidebar />
             </div>
          </div>

          {/* Main Content Area - 7 ส่วน */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white shadow-xl shadow-blue-900/5 rounded-[2.5rem] border border-gray-100 overflow-hidden">
              
              {/* Profile Header */}
              <div className="px-10 py-8 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">ข้อมูลส่วนตัว</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1 italic">จัดการข้อมูลโปรไฟล์ของคุณให้เป็นปัจจุบัน</p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-10 ">
                {["name", "email", "phone", "lineid", "address"].map((field) => (
                  <div key={field} className="relative group">
                    <label className="flex items-center gap-3 text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]  ml-1">
                      <span className="p-1.5 bg-blue-50 rounded-lg">{getIcon(field)}</span>
                      {getLabel(field)}
                    </label>

                    <div className="flex items-center gap-4 min-h-[50px]">
                      {editMode[field as keyof typeof editMode] ? (
                        <div className="flex-1 flex gap-3 animate-in fade-in zoom-in-95 duration-200">
                          {field === 'address' ? (
                            <textarea
                              name={field}
                              autoFocus
                              rows={3}
                              value={formData[field as keyof typeof formData]}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50 border-2 border-blue-200 text-gray-900 rounded-2xl focus:border-blue-500 p-4 outline-none transition-all resize-none font-medium"
                            />
                          ) : (
                            <input
                              type={field === "phone" ? "tel" : "text"}
                              name={field}
                              autoFocus
                              value={formData[field as keyof typeof formData]}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50 border-2 border-blue-200 text-gray-900 rounded-2xl focus:border-blue-500 px-5 py-3 outline-none transition-all font-medium"
                            />
                          )}
                          
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleSave(field)}
                              disabled={savingField === field}
                              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                              {savingField === field ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => handleCancel(field)}
                              className="bg-gray-100 text-gray-400 p-3 rounded-xl hover:bg-gray-200 transition-all"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex justify-between items-center group/item bg-gray-50/30 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all">
                          <span className={`text-lg font-bold ${formData[field as keyof typeof formData] ? 'text-gray-700' : 'text-gray-300 italic'}`}>
                            {formData[field as keyof typeof formData] || 'ยังไม่ได้ระบุข้อมูล'}
                          </span>
                          <button
                            onClick={() => handleEditClick(field)}
                            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-gray-100 opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-2 group-hover/item:translate-x-0"
                          >
                            <Pencil size={14} />
                            แก้ไข
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}