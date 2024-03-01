import Head from "next/head";
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Make sure you import Chart.js
import { IoMdExit } from "react-icons/io";
import { TbPencilPlus } from "react-icons/tb";


const yValues = [2, 5, 4, 0, 10, 3, 1];
const BarChart = ({ title, onBarClick }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Add this line

  useEffect(() => {
    const months = ["SUN", "MON", "TUE", "WED", "THURS", "FRI", "SAT"];
    const barColors = ["#FF5743", "#FF8E4E"];

    const ctx = chartRef.current;

    if (ctx) {
      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance and assign it to chartInstance.current
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'Number of Cases',
            backgroundColor: barColors,
            data: yValues,
          }],
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true, max: 10 },
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          title: { display: true, text: title, fontSize: 20 },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              onBarClick(index);
            }
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [title, onBarClick]);

  return (
    <div className="bar-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};


const RecentNews = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState(null);
  const [reportSummary, setReportSummary] = useState([]);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isDoneSignUpModalVisible, setIsDoneSignUpModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDoneUpdateModalVisible, setIsDoneUpdateModalVisible] = useState(false);


  const generateSummaries = (count) => {
    // Simulates generating 'count' number of summaries
    return Array.from({ length: count }, (_, i) => ({
      lpg: Math.random() * 100,
      co: Math.random() * 100,
      methane: Math.random() * 100,
      nh3: Math.random() * 100,
      co2: Math.random() * 100,
      benzene: Math.random() * 100,
      humidity: Math.random() * 100,
      temperature: 20 + Math.random() * 15,
      dateTime: `2024-01-${i + 1} 12:00`,
    }));
  };


  const handleBarClick = (index) => {
  // Toggle the summary if the same bar is clicked again
  if (index === lastClickedIndex) {
    setReportSummary([]); // Clear the summary
    setLastClickedIndex(null); // Reset the last clicked index
  } else {
    const count = yValues[index]; // Use the actual count from yValues
    setReportSummary(generateSummaries(count)); // Generate summaries based on the count
    setLastClickedIndex(index); // Update the last clicked index
  }
};


  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsOverlayVisible(true);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
    setIsOverlayVisible(false);
  };

  const handleSignUpClick = () => {
    setIsSidebarVisible(false);
    setIsSignUpModalVisible(true);
    setIsOverlayVisible(true);
  };

  
  const handleSignUpClose = () => {
    setIsSignUpModalVisible(false);
    setIsOverlayVisible(false);
  };

  const handleDoneSignUp = () => {
    setIsSignUpModalVisible(false);
    setIsOverlayVisible(true);
    setIsDoneSignUpModalVisible(true);
  };

  const handleCloseSignUp = () => {
    setIsOverlayVisible(false);
    setIsDoneSignUpModalVisible(false);
  };

  const handleUpdateOpen = () => {
    setIsSidebarVisible(false);
    setIsUpdateModalVisible(true);
    setIsOverlayVisible(true);
  };

  const handleUpdateClose = () => {
    setIsUpdateModalVisible(false);
    setIsOverlayVisible(false);
  };

  const handleDoneUpdate = () => {
    setIsDoneUpdateModalVisible(true);
    setIsOverlayVisible(true);
    setIsUpdateModalVisible(false);
  };

  const handleCloseDoneUpdate = () => {
    setIsDoneUpdateModalVisible(false);
    setIsOverlayVisible(false);
  };

  return (
    <>
      <Head>
        <title>R4PRO Website - Recent News</title>
      </Head>
      <section className='head'>
        <img src="/images/logo.png" alt='Logo' onClick={toggleSidebar} onError={(e) => console.error("Error loading logo:", e)} />
        <div className='name'>
          <p className='title'>FOREST FIRE DETECTION AND RECOGNITION SYSTEM</p>
        </div>
      </section>

      {/* Side-Nav-Bar */}
      <section className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <button className="sidebar-exit-button" onClick={closeSidebar}><IoMdExit style={{ height: "20px", width: "20px" }} /></button>
        <nav className='sidenav'>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li onClick={handleSignUpClick}>Sign-Up Other Account</li>
            <li onClick={handleUpdateOpen}>Update Account</li>
            <li><a href="/log-in">Log-Out</a></li>
          </ul>
        </nav>
      </section>

      {isOverlayVisible && <div className="overlay"></div>}

      {/* Here you include the BarChart component */}

      <section className='bar-chart'>
        <div className='reports'>
        <h1>Recent News</h1>
        <div className='graph'>
        <BarChart title="Fire Incidents 2024" onBarClick={handleBarClick} />
        </div>
        </div>
        <div className='summary'>
        {reportSummary.map((summary, index) => (
          <div key={index} className='reports'>
            <h2>Case Number {index + 1}</h2> 
            <p><i>Liquefied Petroleum Gas:</i> {summary.lpg.toFixed(2)}%</p>
            <p><i>Carbon Monoxide:</i> {summary.co.toFixed(2)}%</p>
            <p><i>Methane: </i> {summary.methane.toFixed(2)}%</p>
            <p><i>Ammonia: </i> {summary.nh3.toFixed(2)}%</p>
            <p><i>Carbon Dioxide: </i> {summary.co2.toFixed(2)}%</p>
            <p><i>Benzene: </i> {summary.benzene.toFixed(2)}%</p>
            <p><i>Humidity: </i> {summary.humidity.toFixed(2)}%</p>
            <p><i>Temperature: </i> {summary.temperature.toFixed(2)}%</p>
            {/* Display other details */}
            <p><i>Date and Time: </i> {summary.dateTime}</p>
          </div>
        ))}
        </div>
      </section>

      {isSignUpModalVisible && (
        <div className='sign-up-modal'>
          <div className='modal-content'>
            <div className='title'>
              <TbPencilPlus className='icon' />
              <h2>Sign-Up Other Account</h2>
            </div>
            <div className='form'>
              <div className='inputs'>
              <div className='input-field'>
                    <label htmlFor="uname">Username</label>
                    <input type="uname" id="uname" name="uname" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="confirm-password" id="confirm-password" name="confirm-password" />
                  </div>
              </div>
            </div>
            <div className='buttons'>
              <button className='submit-button' onClick={handleDoneSignUp} type="submit">Sign Up</button>
              <button className='close-button' onClick={handleSignUpClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isDoneSignUpModalVisible && (
        <div className='sign-up-done'>
          <div className='modal-content'>
            <div className='title'>
              <TbPencilPlus className='icon' />
              <h2>Sign-Up Successful!</h2>
            </div>
            <div className='content'>
              <p>Account created. It can now be accessed.</p>
              <button className='close-button' onClick={handleCloseSignUp}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalVisible && (
        <div className='update-modal'>
          <div className='modal-content'>
            <div className='title'>
              <TbPencilPlus className='icon' />
              <h2>Update Account</h2>
            </div>
            <div className='form'>
              <div className='inputs'>
                  <div className='input-field'>
                    <label htmlFor="uname">Username</label>
                    <input type="uname" id="uname" name="uname" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                  </div>

                  <div className='input-field'>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="confirm-password" id="confirm-password" name="confirm-password" />
                  </div>
              </div>
            </div>
            <div className='buttons'>
              <button className='submit-button' onClick={handleDoneUpdate} type="submit">Update</button>
              <button className='close-button' onClick={handleUpdateClose }>Close</button>
            </div>
          </div>
        </div>
      )}

      {isDoneUpdateModalVisible && (
        <div className='update-done'>
          <div className='modal-content'>
            <div className='title'>
              <TbPencilPlus className='icon' />
              <h2>Update Successful!</h2>
            </div>
            <div className='content'>
              <p>Account Updated Successfully.</p>
              <button className='close-button' onClick={handleCloseDoneUpdate }>Close</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default RecentNews;
