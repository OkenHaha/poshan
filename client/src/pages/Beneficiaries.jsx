import React, { useState, useEffect } from 'react';
import axios from 'axios';

const token = "3f2504e0-4f89-11ed-a861-0242ac120002"

const api = axios.create({
  baseURL: 'https://poshan-tau.vercel.app',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    category: '',
    gender: '',
    dob: ''
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await axios.get('/api/v1/beneficiaries');
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/beneficiaries', newBeneficiary);
      fetchBeneficiaries();
      setNewBeneficiary({ name: '', category: '', gender: '', dob: '' });
    } catch (error) {
      console.error('Error adding beneficiary:', error);
    }
  };

  const handleUpdateBeneficiary = async (id, updatedData) => {
    try {
      await axios.put(`/api/v1/beneficiaries/${id}`, updatedData);
      fetchBeneficiaries();
    } catch (error) {
      console.error('Error updating beneficiary:', error);
    }
  };

  return (
    <div>
      <h2>Beneficiaries Management</h2>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Add New Beneficiary</h4>
          <form onSubmit={handleAddBeneficiary}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={newBeneficiary.name}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newBeneficiary.category}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="pregnant">Pregnant Women</option>
                <option value="lactating">Lactating Mothers</option>
                <option value="child0-6">Children (0-6 months)</option>
                <option value="child6-36">Children (6 months-3 years)</option>
                <option value="child36-72">Children (3-6 years)</option>
                <option value="adolescent">Adolescent Girls (15-18 years)</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={newBeneficiary.gender}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, gender: e.target.value })}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={newBeneficiary.dob}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, dob: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Beneficiary</button>
          </form>
        </div>

        <div className="col-md-6">
          <h4>Beneficiaries List</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary._id}>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.category}</td>
                  <td>{beneficiary.gender}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => {
                        setNewBeneficiary(beneficiary);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        // Add delete functionality here
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Beneficiaries;