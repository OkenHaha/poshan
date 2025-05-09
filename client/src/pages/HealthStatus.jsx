import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HealthStatus() {
  const [children, setChildren] = useState([]);
  const [healthData, setHealthData] = useState({
    beneficiaryId: '',
    height: '',
    weight: ''
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/v1/beneficiaries');
      // Filter children categories
      const childCategories = ['child0-6', 'child6-36', 'child36-72'];
      const childrenData = response.data.filter(
        beneficiary => childCategories.includes(beneficiary.category)
      );
      setChildren(childrenData);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchHealthStatus = async (beneficiaryId) => {
    try {
      const response = await axios.get(`/api/v1/nutrition/history/${beneficiaryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health status:', error);
      return null;
    }
  };

  const calculateHealthStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/nutrition/status', {
        beneficiaryId: healthData.beneficiaryId,
        height: parseFloat(healthData.height),
        weight: parseFloat(healthData.weight)
      });
      alert(`Health status calculated!\nHAZ: ${response.data.haz.toFixed(2)}\nWAZ: ${response.data.waz.toFixed(2)}\nWHZ: ${response.data.whz.toFixed(2)}`);
      setHealthData({
        beneficiaryId: '',
        height: '',
        weight: ''
      });
    } catch (error) {
      console.error('Error calculating health status:', error);
      alert('Error calculating health status');
    }
  };

  const updateHealthRecord = async (beneficiaryId, updatedData) => {
    try {
      await axios.post('/api/v1/nutrition/status', {
        beneficiaryId,
        height: updatedData.height,
        weight: updatedData.weight
      });
      alert('Health record updated successfully');
    } catch (error) {
      console.error('Error updating health record:', error);
      alert('Error updating health record');
    }
  };

  return (
    <div>
      <h2>Health Status Management</h2>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Children List</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child._id}>
                  <td>{child.name}</td>
                  <td>{child.category}</td>
                  <td>{child.gender}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={async () => {
                        const healthStatus = await fetchHealthStatus(child._id);
                        if (healthStatus && healthStatus.length > 0) {
                          alert(`Last health status:\nHAZ: ${healthStatus[0].haz.toFixed(2)}\nWAZ: ${healthStatus[0].waz.toFixed(2)}\nWHZ: ${healthStatus[0].whz.toFixed(2)}`);
                        } else {
                          alert('No health records found');
                        }
                      }}
                    >
                      Check Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h4>Health Calculator</h4>
          <form onSubmit={calculateHealthStatus}>
            <div className="mb-3">
              <label className="form-label">Select Beneficiary</label>
              <select
                className="form-select"
                value={healthData.beneficiaryId}
                onChange={(e) => setHealthData({ ...healthData, beneficiaryId: e.target.value })}
                required
              >
                <option value="">Select beneficiary</option>
                {children.map((child) => (
                  <option key={child._id} value={child._id}>{child.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="form-control"
                value={healthData.height}
                onChange={(e) => setHealthData({ ...healthData, height: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                value={healthData.weight}
                onChange={(e) => setHealthData({ ...healthData, weight: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Calculate Status</button>
          </form>

          <div className="mt-4">
            <h4>Update Health Record</h4>
            <div className="row">
              <div className="col-md-4">
                <button className="btn btn-success w-100 mb-2">Stunted Children</button>
                <button className="btn btn-warning w-100 mb-2">Wasted Children</button>
                <button className="btn btn-danger w-100">Underweight Children</button>
              </div>
              <div className="col-md-8">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Health records will be displayed here */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthStatus;