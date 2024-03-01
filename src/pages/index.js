import React, { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import ProgressBar from '@ramonak/react-progress-bar';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { GrAlert } from "react-icons/gr";
import { TbPencilPlus } from "react-icons/tb";
import { IoMdExit } from "react-icons/io";
import dynamic from 'next/dynamic';


const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });
export default function Home() {
  const [isThermalCamera, setIsThermalCamera] = useState(false);
  const videoRef = useRef(null);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [isSentModalVisible, setIsSentModalVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [chancesOfFire, setChancesOfFire] = useState(0.3);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isDoneSignUpModalVisible, setIsDoneSignUpModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDoneUpdateModalVisible, setIsDoneUpdateModalVisible] = useState(false);
  
  // Simulated thermal data for demonstration purposes
  const thermalData = Array(64).fill(null).map(() => Math.floor(Math.random() * 50 + 1));

  const LPG = 20;
  const CO = 40;
  const CH4 = 10;
  const NH3 = 50;
  const CO2 = 30;
  const C6H6 = 70;
  const Temperature = 27;
  const Humidity = 90;

  useEffect(() => {
    if (!isThermalCamera) {
      startCamera();
    }
    return () => {
      if (videoRef.current && !isThermalCamera) {
        const stream = videoRef.current.srcObject;
        if (stream) { // Ensure stream is not null before calling getTracks
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, [isThermalCamera]);
  

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCameraToggle = () => {
    setIsThermalCamera(!isThermalCamera);
  };

  const handleSendAlertClick = () => {
    setIsAlertModalVisible(true);
    setIsOverlayVisible(true);
  };

  const handleCloseModal = () => {
    setIsAlertModalVisible(false);
    setIsOverlayVisible(false);
    setIsSentModalVisible(false);
  };

  const handleSendAlert = () => {
    setIsAlertModalVisible(false);
    setIsSentModalVisible(true);
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

  return (
    <>
        <Head>
          <title>R4PRO Website</title>
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
                <li><a href="/recent-news">Recent News</a></li>
                <li onClick={handleSignUpClick}>Sign-Up Other Account</li>
                <li onClick={handleUpdateOpen}>Update Account</li>
                <li><a href="/log-in">Log-Out</a></li>
              </ul>
            </nav>
      </section>



      <div className="forest-status">

        <section className="air-quality-index">

          <h1>Air Quality Index</h1>

          <div className='gas'>

          <div className="LPG">
            <h2>Liquefied Petroleum Gas</h2>
            <div className='data'>
                <CircularProgressbar className='gauge1' value={LPG} maxValue={100} text={`${LPG}%`} />
            </div>
          </div>

          <div className="CO">
            <h2>Carbon Monoxide</h2>

            <div className='data'>
                <CircularProgressbar className='gauge1' value={CO} maxValue={100} text={`${CO}%`} />
            </div>
          </div>

          <div className="CH4">
          <h2>Methane</h2>

          <div className='data'>
          <CircularProgressbar className='gauge1' value={CH4} maxValue={100} text={`${CH4}%`} />
          </div>
          </div>

            <div className='NH3'>
                <h2>Ammonia</h2>
                <div className='data'>
                <CircularProgressbar className='gauge2' value={NH3} maxValue={100} text={`${NH3}%`} />
                </div>
            </div>

            <div className='CO2'>
              <h2>Carbon Dioxide</h2>
              <div className='data'>
                <CircularProgressbar className='gauge2' value={CO2} maxValue={100} text={`${CO2}%`} />
                </div>
            </div>

            <div className='C6H6'>
              <h2>Benzene</h2>
              <div className='data'>
                <CircularProgressbar className='gauge2' value={C6H6} maxValue={100} text={`${C6H6}%`} />
                </div>
            </div>


          </div>

        </section>



        <section className="heat-index">

        <h1>Heat Index</h1>

        <div className='heat'>

        <div className='two-sensors'>
            <div className="Temperature">
                <h2>Temperature</h2>
                <div className='data'>
                  <ProgressBar completed={Temperature}
                    className='bar'
                    customLabel={`${Temperature}°C`}
                    bgColor='#FEC54C' />
                    
                </div>

            </div>

            <div className="Humidity">
              <h2>Humidity</h2>
                <div className='data'>
                  <ProgressBar completed={Humidity}
                    className='bar'
                    bgColor='#FEC54C' />
                </div>

            </div>
        </div>

        <div className='alert'>

          <h1 onClick={handleSendAlertClick}> SEND <br />ALERT </h1>

        </div>

        </div>

        <div className='status'>
          <div className='chances-of-fire'>
            <h2>Chances of Fire</h2>
            <div className='chance-gauge'>
            <GaugeChart
              id="gauge-chart5"
              nrOfLevels={400}
              arcsLength={[0.35, 0.35, 0.3]}
              colors={['#2e8b57', '#FEC54C', '#FF5743']}
              percent={chancesOfFire}
              arcPadding={0.02}
              textColor={['#FEC54C']}
            />
            </div>
          </div>
          <div className="Camera">
            <div className='title' onClick={handleCameraToggle}>
                <h2>{isThermalCamera ? "Heat Map" : "Normal Camera"}</h2>
                <h5>Switch View</h5>
            </div>

            <div className='video'>
              {!isThermalCamera ? (
                <video ref={videoRef} autoPlay playsInline muted className='video' />
              ) : (
                <div className="thermal-grid-container">
                  <table className='thermal-table'>
                    <tbody>
                    {[...Array(8)].map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {[...Array(8)].map((_, colIndex) => {
                          const value = thermalData[rowIndex * 8 + colIndex];
                          let color;
                          // Color calculation based on value
                          if (value < 11) { color = '#0000A4'; }
                          else if (value < 16) { color = '#0071F7'; }
                          else if (value < 21) { color = '#0DECEA'; }
                          else if (value < 26) { color = '#0BEDEB'; }
                          else if (value < 31) { color = '#6CFD74'; }
                          else if (value < 36) { color = '#F4FF4C'; }
                          else if (value < 41) { color = '#F39719'; }
                          else if (value < 50) { color = '#F76D0E'; }
                          else { color = '#F32301'; }
                          return (
                            <td key={colIndex} style={{ backgroundColor: color }}>
                              {value}°C
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        </section>

      </div>


      {isOverlayVisible && <div className="overlay"></div>}

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

      {isAlertModalVisible && (
        <div className='alert-modal'>
          <div className='modal-content'>

            <div className='title'>
              <GrAlert className='icon' />
              <h2>Send Alert</h2>
            </div>

            <p>Are you sure you want to send an alert to the 
                  nearby barangays about a suspected fire?</p>
            <div className='alert-buttons'>
              <button className='alert-send-button' onClick={handleSendAlert}>Send Alert</button>
              <button  className='alert-cancel-button' onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isSentModalVisible && (
        <div className='sent-modal'>
          <div className='modal-content'>
            <h2>Alert Sent!</h2>
            <p>Keep Safe and Prepare BFP Fire Fighters</p>
            <button  className='alert-cancel-button' onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

    </>
  );
}
