'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import NavbarUser from "../../../components/navbaruser";
import axios from "axios";

export default function Information() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    lineid: false,
    address: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lineid: '',
    address: ''
  });

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/user/${session.user.email}`);
      setUserData(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        lineid: response.data.lineid,
        address: response.data.address
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else {
      fetchPosts();
    }
  }, [router, status]);

  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "phone" ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSave = async (field) => {
    try {
      await axios.put(`/api/user/${session.user.email}`, {
        [field]: formData[field]
      });
      setUserData((prev) => ({ ...prev, [field]: formData[field] }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
  
      if (field === 'name') {
        await fetchPosts(); // Refetch user data
        window.location.reload(); // Refresh the page
      } else if (field === 'email') {
        router.push('/user/login'); // Redirect to /user/login
      }
    } catch (error) {
      setError('Failed to save changes');
    }
  };

  return (
    status === 'authenticated' && session.user && userData && (
      <div>
        <NavbarUser />

        <div className="p-8">
          <div className="grid grid-cols-6 gap-5 p-8">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="col-span-4 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">MY INFORMATION</h2>

              <div className="flex flex-col md:flex-row">
                {/* Information Box */}
                <div className="w-full md:w-3/5 mb-8 md:mb-0 md:mr-8">
                  {['name', 'email', 'phone', 'lineid', 'address'].map((field) => (
                    <div className="flex justify-between mb-4" key={field}>
                      <span className="font-medium capitalize">{field}:</span>
                      {editMode[field] ? (
                        <input
                          type={field === 'phone' ? 'number' : 'text'}
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          className="border p-2 rounded-md"
                        />
                      ) : (
                        <span>{formData[field]}</span>
                      )}
                      {editMode[field] ? (
                        <button
                          className="underline text-blue-500 hover:text-blue-700"
                          onClick={() => handleSave(field)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="underline text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditClick(field)}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* User Image */}
                {/* <div className="w-full md:w-2/5 flex flex-col items-center">
                  <img src="/toothlessm.jpg" alt="User Profile" className="w-48 h-48 rounded-full border-4 border-gray-300" />
                  <button className="bg-[#F7BB97] hover:bg-[#F00020] text-white py-3 px-8 rounded-lg font-bold mt-5">Change Profile</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
   