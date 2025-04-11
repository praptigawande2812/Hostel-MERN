import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ComplaintsDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [unsolvedComplaints, setUnsolvedComplaints] = useState([]);

  useEffect(() => {
    getComplaints();
  }, []);

  const getComplaints = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaint/all`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setComplaints(data.complaints);
        setUnsolvedComplaints(data.complaints.filter((c) => c.status !== "solved"));
      } else {
        toast.error(data.errors?.[0]?.msg || "Failed to fetch complaints", { 
          position: "top-right", 
          autoClose: 3000 
        });
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints. Please try again later.");
    }
  };

  const resolveComplaint = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaint/resolve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id }),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success("Complaint resolved successfully!");
        setUnsolvedComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
      } else {
        toast.error("Failed to resolve complaint.");
      }
    } catch (error) {
      toast.error("Server error while resolving complaint.");
    }
  };
  

  const transformApiData = (apiData) => {
    const complaintMap = new Map();
    apiData.forEach((complaint) => {
      const date = new Date(complaint.date);
      const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      complaintMap.set(formattedDate, (complaintMap.get(formattedDate) || 0) + 1);
    });

    return Array.from(complaintMap.entries()).map(([date, count]) => ({
      name: date,
      DailyComplaints: count,
    }));
  };

  const data = transformApiData(complaints);

  return (
    <div className="w-full h-screen flex flex-col gap-10 md:gap-7 pt-32 items-center justify-center overflow-auto">
      <h1 className="text-white font-bold text-5xl">Complaints</h1>
      <div className="flex md:gap-7 flex-wrap justify-center items-center gap-7">
        <ResponsiveContainer width="100%" height={300} className="bg-neutral-950 px-7 py-5 rounded-xl shadow-xl w-full max-w-[350px]">
          <AreaChart data={data} margin={{ top: 5, right: 50, bottom: 15, left: -25 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="DailyComplaints" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>

        <div className="bg-neutral-950 px-10 py-5 rounded-xl shadow-xl w-96 max-h-64 overflow-auto">
          <span className="text-white font-bold text-xl">New Complaints</span>
          <ul role="list" className="divide-y divide-gray-700 text-white">
            {unsolvedComplaints.length === 0 ? (
              <li className="py-3 text-center">No new complaints!</li>
            ) : (
              unsolvedComplaints.map((complaint) => (
                <li className="py-3 sm:py-4 px-5 rounded hover:bg-neutral-700 hover:scale-105 transition-all flex items-center justify-between" key={complaint._id}>
                  <div className="flex items-center space-x-4">
                    <div className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">{complaint.title}</p>
                      <p className="text-sm truncate text-gray-400">{complaint.description}</p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer hover:scale-125 hover:text-green-600 transition-all"
                    onClick={() => resolveComplaint(complaint._id)}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} newestOnTop={true} closeOnClick={true} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} theme="dark" />
    </div>
  );
};

export default ComplaintsDashboard;