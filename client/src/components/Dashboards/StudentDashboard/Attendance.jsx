import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Attendance() {
  const [totalDays, setTotalDays] = useState(0);
  const [daysOff, setDaysOff] = useState(0);
  const [thisWeek, setThisWeek] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAttendance = async () => {
    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student) {
        throw new Error("Student information not found");
      }

      const response = await fetch("http://localhost:5000/api/attendance/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ student: student._id }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || "Failed to fetch attendance");
      }

      if (data.success) {
        let daysOff = 0;
        let thisWeek = [];
        data.attendance.forEach((day) => {
          if (day.status === "absent") {
            daysOff++;
          }
          if (new Date(day.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            thisWeek.push({
              weekdate: new Date(day.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              weekday: new Date(day.date).toLocaleDateString('en-PK', {
                weekday: "long"
              }),
              present: day.status === "present"
            });
          }
        });
        setDaysOff(daysOff);
        setThisWeek(thisWeek);
        setTotalDays(data.attendance.length);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error(error.message || "Failed to fetch attendance", {
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
    getAttendance();
  }, []);

  const labels = ["Days off", "Days present"];

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
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center max-h-screen overflow-y-auto pt-20 md:pt-0">
      <h1 className="text-white font-bold text-5xl">Attendance</h1>
      <ul className="flex gap-5 text-white text-xl px-5 sm:p-0 text-center">
        <li>Total Days: {loading ? loader : totalDays}</li>
        <li>Present Days: {loading ? loader : totalDays - daysOff}</li>
        <li>Absent days: {loading ? loader : daysOff}</li>
      </ul>
      <div className="flex gap-5 flex-wrap max-h-96 justify-center items-center">
        <Doughnut
          datasetIdKey="id"
          data={{
            labels,
            datasets: [
              {
                label: "days",
                data: [daysOff, totalDays - daysOff],
                backgroundColor: ["#F26916", "#1D4ED8"],
                barThickness: 40,
                borderRadius: 5,
                borderColor: "rgba(0,0,0,0)",
                hoverOffset: 10,
              },
            ],
          }}
        />
        <div className="flow-root bg-neutral-950 rounded-lg shadow-xl w-full mx-5 sm:m-0 sm:w-80 p-5">
          <p className="text-white text-xl font-bold">This Week</p>
          <ul role="list" className="divide-y divide-gray-700">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                {loader} Loading attendance...
              </div>
            ) : thisWeek.length === 0 ? (
              <div className="text-white text-center py-4">No attendance records found</div>
            ) : (
              thisWeek.map((day, index) => (
                <li className="py-3 sm:py-4" key={index}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {day.weekday} -- {day.weekdate}
                      </p>
                      <p className="text-sm truncate text-gray-400">
                        {day.present ? "Present" : "Absent"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-base font-semibold text-white">
                      {day.present ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Attendance;
