import React from 'react';

function Home() {
  return (
    <div className="text-center">
      <h1>Welcome to Poshan Tracker</h1>
      <p className="lead">Track nutritional status of beneficiaries</p>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Beneficiaries</h5>
              <p className="card-text">Manage beneficiary information</p>
              <Link to="/beneficiaries" className="btn btn-primary">Go to Beneficiaries</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Health Status</h5>
              <p className="card-text">Check and manage nutritional status</p>
              <Link to="/health-status" className="btn btn-primary">Go to Health Status</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;