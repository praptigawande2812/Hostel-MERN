import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WashingMachine() {
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [requests, setRequests] = useState(0);
  const [approved, setApproved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestsList, setRequestsList] = useState([]);

  const requestWashingMachine = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student) {
        throw new Error("Student information not found");
      }

      console.log("Student data:", student);

      const data = {
        student: student._id,
        slot_date: slotDate,
        slot_time: slotTime,
      };

      console.log("Request data:", data);
      console.log("Token:", localStorage.getItem("token"));

      const response = await fetch("http://localhost:5000/api/washingmachine/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);
      
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.msg || result.message || "Failed to request washing machine slot");
      }

      if (result.success) {
        setRequests(requests + 1);
        setSlotDate("");
        setSlotTime("");
        toast.success('Washing Machine Slot Requested Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error requesting washing machine slot:", error);
      toast.error(error.message || "Failed to request washing machine slot", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRequests = async () => {
    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student) {
        throw new Error("Student information not found");
      }

      const response = await fetch("http://localhost:5000/api/washingmachine/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          hostel: student.hostel,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.msg || "Failed to fetch washing machine requests");
      }

      if (result.success) {
        setApproved(result.approved);
        setRequests(result.list.length);
        setRequestsList(result.list);
      }
    } catch (error) {
      console.error("Error fetching washing machine requests:", error);
      toast.error(error.message || "Failed to fetch washing machine requests", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, [requests]);

  function handleDateChange(e) {
    setSlotDate(e.target.value);
  }

  function handleTimeChange(e) {
    setSlotTime(e.target.value);
  }

  const dateField = {
    name: "slot date",
    placeholder: "",
    req: true,
    type: "date",
    value: slotDate,
    onChange: handleDateChange,
  };

  const timeField = {
    name: "slot time",
    placeholder: "",
    req: true,
    type: "time",
    value: slotTime,
    onChange: handleTimeChange,
  };

  const loader = (
    <svg
      aria-hidden="true"
      className="inline w-4 h-4 mr-2 animate-spin text-white fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );

  return (
    <div className="w-full h-screen gap-10 flex flex-col items-center justify-center max-h-screen overflow-y-auto pt-[500px] sm:pt-96 md:pt-96 lg:pt-40">
      <h1 className="text-white font-bold text-5xl">Washing Machine</h1>
      <ul className="flex gap-5 text-white text-xl px-5 sm:p-0 text-center">
        <li>Approved: {loading ? loader : approved}</li>
        <li>Pending: {loading ? loader : requests}</li>
      </ul>
      <div className="w-full gap-10 flex items-center justify-center flex-wrap">
        <div className="h-[30vh] gap-2 flex items-center justify-center flex-wrap">
          <Doughnut
            datasetIdKey="id"
            data={{
              labels: ["Approved", "Pending"],
              datasets: [
                {
                  label: "Washing Machine",
                  data: [approved, requests],
                  backgroundColor: ["#1D4ED8", "#F26916"],
                  barThickness: 20,
                  borderRadius: 0,
                  borderJoinStyle: "round",
                  borderColor: "rgba(0,0,0,0)",
                  hoverOffset: 10,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
          <ul className="text-white">
            <li className="flex gap-2">
              <span className="w-10 h-5 bg-blue-500 block"></span>Approved
            </li>
            <li className="flex gap-2">
              <span className="w-10 h-5 bg-orange-500 block"></span>Pending
            </li>
          </ul>
        </div>
        <div className="w-full sm:w-80 max-w-md max-h-60 p-4 border rounded-lg shadow sm:p-8 bg-neutral-950 border-neutral-900 drop-shadow-xl overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-white">
              All Requests
            </h5>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-700 text-white ">
              {requestsList.length === 0
                ? "No requests Sent"
                : requestsList.map((req) => (
                    <li className="py-3 sm:py-4" key={req._id}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-white">
                            {req.status.toUpperCase()}
                          </p>
                          <p className="text-sm truncate text-gray-400">
                            {new Date(req.slot_date).toDateString().slice(4, 10)} at {req.slot_time}
                          </p>
                        </div>
                        <div className="flex flex-col items-center text-base font-semibold text-white">
                          {new Date(req.request_date).toDateString().slice(4,10)}
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
      <form
        method="POST"
        onSubmit={requestWashingMachine}
        className="bg-neutral-950 py-5 px-10 rounded-lg shadow-xl w-full sm:w-auto"
      >
        <div className="flex gap-5">
          <Input field={dateField} />
          <Input field={timeField} />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-xl rounded-lg px-5 py-2.5 mt-5 text-center"
        >
          {loading ? (
            <div>{loader} Sending Request...</div>
          ) : (
            "Request Slot"
          )}
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </form>
    </div>
  );
}

export default WashingMachine; 