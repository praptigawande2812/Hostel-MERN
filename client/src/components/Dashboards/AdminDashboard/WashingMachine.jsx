import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from 'react-top-loading-bar';

function WashingMachine() {
  const [progress, setProgress] = useState(0);
  const [newReqs, setNewReqs] = useState([]);
  const [approvedReqs, setApprovedReqs] = useState([]);
  const [rejectedReqs, setRejectedReqs] = useState([]);
  const graphData = useRef([0, 0, 0]);

  const getRequests = async () => {
    setProgress(30);
    try {
      const res = await fetch("http://localhost:5000/api/washingmachine/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setProgress(40);
      const data = await res.json();
      setProgress(60);
      if (data.success) {
        data.list.map((req) => {
          req.id = req._id;
          req.date = new Date(req.slot_date).toDateString();
          req.time = req.slot_time;
          req._id = req.student._id;
          req.title = `${req.student.name} [ Room: ${req.student.room_no}]`;
          req.desc = `${req.date} at ${req.time}`;
          setProgress(progress + 10);
        });
        setProgress(80);
        setNewReqs(data.list);
        setApprovedReqs(data.approved);
        setRejectedReqs(data.rejected);
        graphData.current = [
          approvedReqs.length,
          rejectedReqs.length,
          newReqs.length,
        ];
      } else {
        toast.error(data.errors?.[0]?.msg || "Failed to fetch washing machine requests");
      }
    } catch (error) {
      toast.error("Failed to fetch washing machine requests");
    }
    setProgress(100);
  };

  const updateRequest = async (id, status) => {
    try {
      const res = await fetch("http://localhost:5000/api/washingmachine/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Request ${status} successfully`);
        getRequests();
      } else {
        toast.error(data.errors?.[0]?.msg || "Failed to update request");
      }
    } catch (error) {
      toast.error("Failed to update request");
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const data = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Washing Machine Requests",
        data: graphData.current,
        backgroundColor: ["#4CAF50", "#FF0000", "#FFA500"],
      },
    ],
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center max-h-screen overflow-x-hidden overflow-y-auto pt-[400px] sm:pt-96 md:pt-96 lg:pt-80 xl:pt-20">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <h1 className="text-white font-bold text-5xl text-center">
        Washing Machine Requests
      </h1>
      <div className="flex w-full gap-5 sm:px-20 pt-5 flex-wrap items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-neutral-950 p-6 rounded-xl shadow-xl">
            <h2 className="text-white text-xl mb-4">Request Statistics</h2>
            <div className="w-full h-64">
              <Bar data={data} />
            </div>
          </div>
        </div>
        <div className="w-full max-w-md">
          <div className="bg-neutral-950 p-6 rounded-xl shadow-xl">
            <h2 className="text-white text-xl mb-4">Pending Requests</h2>
            <div className="space-y-4">
              {newReqs.map((req) => (
                <div
                  key={req.id}
                  className="bg-neutral-900 p-4 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-semibold">{req.title}</h3>
                    <span className="text-gray-400">{req.desc}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRequest(req.id, "approved")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateRequest(req.id, "rejected")}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {newReqs.length === 0 && (
                <p className="text-gray-400 text-center">No pending requests</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default WashingMachine; 