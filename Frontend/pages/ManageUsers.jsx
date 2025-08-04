import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { FaTrashAlt } from 'react-icons/fa';
import { getAllUsers, getAllHotelOwners } from '../services/AdminService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [hotelOwners, setHotelOwners] = useState([]);
  const [searchOwner, setSearchOwner] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || [];
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(() => {
        setUsers([]);
        setFilteredUsers([]);
      });

    getAllHotelOwners()
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || [];
        setHotelOwners(data);
      })
      .catch(() => {
        setHotelOwners([]);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      [user.name, user.username, user.email, user.role].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
    setFilteredUsers(filtered);
  };

  const handleOwnerSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchOwner(value);
    const filtered = hotelOwners.filter((owner) =>
      [owner.name, owner.username, owner.email, owner.role].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
    setHotelOwners(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase() || '';
      const valB = b[key]?.toString().toLowerCase() || '';
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/users/deleteuser/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      if (res.data === "Deleted") {
        alert("User deleted successfully");
        setUsers(prev => prev.filter(user => user.id !== id));
        setFilteredUsers(prev => prev.filter(user => user.id !== id));
        setHotelOwners(prev => prev.filter(owner => owner.id !== id));
      }
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="pt-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <AdminNavbar />
      </div>

      <div className="p-4 shadow-3xl">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Name, Username, Email, or Role"
            value={searchTerm}
            onChange={handleSearch}
            className="input input-bordered w-full max-w-md shadow-3xl border"
          />
          <button
            className="ml-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
            onClick={() => navigate("/register")}
          >
            Add User
          </button>
        </div>

        {/* Users Table */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Users Table</h2>
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto mb-10">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('id')}>User ID</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('role')}>Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-red text-red px-3 py-1 rounded hover:bg-red-700 transition"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrashAlt className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Hotel Owners Table */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Hotel Owners</h2>
        <input
          type="text"
          placeholder="Search by Name, Username, Email, or Role"
          value={searchOwner}
          onChange={handleOwnerSearch}
          className="input input-bordered w-full max-w-md mb-4 shadow-3xl border"
        />
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {hotelOwners.length > 0 ? (
                hotelOwners.map((owner, index) => (
                  <tr key={owner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{owner.id}</td>
                    <td className="px-4 py-3">{owner.name}</td>
                    <td className="px-4 py-3">{owner.username}</td>
                    <td className="px-4 py-3">{owner.email}</td>
                    <td className="px-4 py-3">{owner.role}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-red text-red px-3 py-1 rounded hover:bg-red-700 transition"
                        onClick={() => handleDelete(owner.id)}
                      >
                        <FaTrashAlt className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No hotel owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
