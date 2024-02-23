import React, { useEffect, useRef, useState } from 'react';
  import Head from 'next/head';
  import { Inter } from 'next/font/google';
  import dynamic from 'next/dynamic';
  import Chart from 'chart.js/auto';
  import { CircularProgressbar } from 'react-circular-progressbar';
  import { GrAlert } from "react-icons/gr";
  import { RiError,  WarningFill } from "react-icons/ri";
  import 'react-circular-progressbar/dist/styles.css';

  const inter = Inter({ subsets: ['latin'] });

  const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });
  const RadialGauge = ({ value, size = 100, strokeWidth = 10, isPercentage = false }) => {
    return (
      <div className='radialGauge'>
        <CircularProgressbar
          value={value}
          text={isPercentage ? `${value}%` : `${value}°C`}
          styles={{
            path: {
              stroke: `#b4d3b2`,
              strokeWidth: strokeWidth,
            },
            text: {
              fill: '#898FAE',
              fontSize: '20px',
            },
          }}
          strokeWidth={strokeWidth}
          circleRatio={1.0}
          className={`custom-radial-gauge-size-${size}`}
        />
      </div>
    );
  };



  const BarChart = ({ title}) => {
    const chartRef = useRef(null);

    useEffect(() => {
      // Data for the chart
      const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
      ];
      const yValues = [55, 49, 44, 24, 15, 40, 35, 28, 19, 32, 45, 50];
      const barColors = ["#FF5743", "#FF8E4E"];

      const ctx = chartRef.current;

      if (ctx) {
        // Create or update the chart
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: months,
            datasets: [{
              label: 'Number of Cases',
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
                max: 60,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
              display: true,
              text: title,
              fontSize: '20px',
            },
            onClick: (event) => {
              const activePoints = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
              if (activePoints.length) {
                const clickedIndex = activePoints[0].index;
                onBarClick(clickedIndex);
              }
            },
          }
        });

        // Destroy the chart on component unmount
        return () => {
          chart.destroy();
        };
      }
    }, [title]);

    return (
      <div className="bar-chart-container">
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h2>
        <canvas ref={chartRef}></canvas>
      </div>
    );
  };

  const Home = () => {
    const videoRef = useRef(null);
    const [isThermalCamera, setIsThermalCamera] = useState(true);
    const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isSentModalVisible, setIsSentModalVisible] = useState(false);
    const thermalVideoRef = useRef(null);
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [gasPercentage, setGasValue] = useState(0);
    const [thermalData, setThermalData] = useState([]);
    const [isFireModalVisible, setIsFireModalVisible] = useState(false);
    const [flame, setFlame] = useState('Not Detected');
    const [chancesOfFire, setChancesOfFire] = useState(0);

  

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          console.error('Video element not found.');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
  

    

    useEffect(() => {
      startCamera();
  
      return () => {
        const videoElement = videoRef.current;
        if (videoElement) {
          const stream = videoElement.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          }
        }
      };
    }, []);

    
    const thermalTableRows = thermalData.map((row, rowIndex) => {
      if (!Array.isArray(row)) {
        console.error(`Row at index ${rowIndex} is not an array:`, row);
        return null; // or handle the error appropriately
      }
    
    });
    
    
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.199.130/');
          const data = await response.json();
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          setGasValue(data.gasPercentage);
          // Update flame status based on the received data
          setFlame(data.flame === 'Yes' ? 'YES' : 'NO'); // Update the comparison here

    
          // Check if flame is detected and set FireModal visibility accordingly
          if (data.flame === 'Yes') {
            setIsFireModalVisible(true);
          } else {
            setIsFireModalVisible(false);
          }
    
          setThermalData(data.pixels);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
    
      const intervalId = setInterval(fetchData, 3000);
    
      return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
      // Calculate chances of fire based on temperature and humidity
      const calculateChancesOfFire = () => {
        let newChancesOfFire = 0;
        // Adjust the thresholds as needed
        if (temperature > 25 && humidity < 40 && flame == "YES" && gasPercentage < 500) {
          newChancesOfFire = 0.8; // High chances of fire
        } else if (temperature > 20 && humidity < 50 && flame == "YES" && gasPercentage < 100) {
          newChancesOfFire = 0.6; // Medium chances of fire
        } else if (temperature > 15 && humidity < 60 && gasPercentage < 50) {
          newChancesOfFire = 0.4; // Low chances of fire
        } else {
          newChancesOfFire = 0.2; // Minimal chances of fire
        }
        setChancesOfFire(newChancesOfFire);
      };
  
      calculateChancesOfFire();
    }, [temperature, humidity]);
   

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.254.123/');
          const data = await response.json();
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          setGasValue(data.gasPercentage);
          // Update flame status based on the received data
          setFlame(data.flame === 'Detected' ? 'YES' : 'NO');
    
          // Check if flame is detected and set FireModal visibility accordingly
          if (data.flame === 'Yes') {
            setIsFireModalVisible(true);
          } else {
            setIsFireModalVisible(false);
          }
    
          setThermalData(data.pixels);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
    
      const intervalId = setInterval(fetchData, 5000);
    
      return () => clearInterval(intervalId);
    }, []);
    


    const startThermalCamera = async () => {
      try {
        const thermalStream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (thermalVideoRef.current) {
          thermalVideoRef.current.srcObject = thermalStream;
        } else {
          console.error('Thermal video element not found.');
        }
      } catch (error) {
        console.error('Error accessing thermal camera:', error);
      }
    };

    const handleCameraToggle = () => {
      setIsThermalCamera((prevIsThermalCamera) => {
        const newIsThermalCamera = !prevIsThermalCamera;

        if (newIsThermalCamera) {
          startThermalCamera();
        } else {
          startCamera();
        }

        return newIsThermalCamera;
      });
    };

    const handleSendAlert = () => {
      setIsOverlayVisible(true);
      setIsAlertModalVisible(true);
      setIsFireModalVisible(false);
    };

    const handleFireModalOpen = () => {
      setIsOverlayVisible(true);
      setIsFireModalVisible(true);
    }

    const handleFireModalClose = () => {
      setIsOverlayVisible(false);
      setIsFireModalVisible(false);
    }

    const handleAlertModalClose = () => {
      setIsOverlayVisible(false);
      setIsAlertModalVisible(false);
      setIsFireModalVisible(false);
    };

    const handleSentModalOpen = () => {
      setIsOverlayVisible(true);
      setIsSentModalVisible(true);
      setIsAlertModalVisible(false);
    };

    const handleSentModalClose = () => {
      setIsSentModalVisible(false);
      setIsAlertModalVisible(false);
    };

    

    return (
      <>
        <Head>
          <title>R4PRO Website</title>
        </Head>
        <section className='head'>
          <img src="/images/logo.png" alt='Logo' onError={(e) => console.error("Error loading logo:", e)} />
          <div className='name'>
            <p className='title'>FOREST FIRE DETECTION AND RECOGNITION SYSTEM</p>
          </div>
        </section>

        <section className='forest-status'>
          <div className='update'>
          <div className='bar-chart'>
                <BarChart title='Fire Incidents 2023'  />
            </div>

            <div className='notify'>
              <div className='alert'>
                <button className='danger' onClick={handleSendAlert}>Send Alert</button>
              </div>
              <div className='chances'>
                <h1 className='title'>Chances of Fire</h1>
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
          </div>

          <div className='update'>
            <div className='notify-2'>
              <div className='temperature'>
                <h1 className='title'>Temperature</h1>
                <div className='gauge'>
                  <RadialGauge value={temperature} strokeWidth={7} />
                </div>
              </div>
              <div className='gas'>
                <h1 className='title'>Detected Gas</h1>
                <div className='gauge'>
                  <RadialGauge value={gasPercentage} strokeWidth={7} isPercentage />
                </div>
              </div>
              <div className='humidity'>
                <h1 className='title'>Humidity</h1>
                <div className='gauge'>
                  <RadialGauge value={humidity} strokeWidth={7} isPercentage />
                </div>
              </div>
            </div>
            
            <div className='camera' onClick={handleCameraToggle}>
              <div className='text'>
                <h1 className='title'>{isThermalCamera ? 'Heat Map' : 'Normal Camera'}</h1>
                <div className='end'>
                  <p className='title'>Switch View</p>
                </div>
              </div>
                  {isThermalCamera ? (
                      <div className="thermal-grid-container">
                      <table className='thermal-table'>
                        <tbody>
                        {[...Array(8)].map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {[...Array(8)].map((_, colIndex) => {
                              const value = thermalData[rowIndex * 8 + colIndex];
                              let color;
                              if (value < 11) {
                              color = '#0000A4';
                            } else if (value < 16) {
                              color = '#0071F7';
                            } else if (value < 21) {
                              color = '#0DECEA';
                            } else if (value < 26) {
                              color = '#0BEDEB';
                            } else if (value < 31) {
                              color = '#6CFD74';
                            } else if (value < 36) {
                              color = '#F4FF4C';
                            } else if (value < 41) {
                              color = '#F39719';
                            } else if (value < 50) {
                              color = '#F76D0E';
                            } else {
                              color = '#F32301';
                            }
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
                  ) : (
                      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '280px' }} />
                  )}       
            </div>
          </div>
        </section>

        {isAlertModalVisible && (
          <>
            <div className='overlay' style={{ display: isOverlayVisible ? 'block' : 'none' }}></div>
            <div className='alert-modal'>
              <div className='modal-content'>
                <div className='title'>
                  <GrAlert className='icon' />
                  <h2>Send Alert</h2>
                </div>
                <p>Are you sure you want to send an alert to the 
                  nearby barangays about a suspected fire?</p>
                  <div className='alert-buttons'>
                  <button onClick={handleSentModalOpen }className='alert-send-button'>
                    Send
                  </button>
                 <button onClick={handleAlertModalClose} className='alert-cancel-button'>
                    Cancel
                  </button>
                  </div>
              </div>
            </div>
          </>
        )}

{isFireModalVisible && (
          <>
          <div className='overlay' style={{ display: isOverlayVisible ? 'block' : 'none' }}></div>
            <div className='alarm-modal'>
              <div className='modal-content'>
                <div className='title'>
                  <h2>Warning!!</h2>
                  <p>Possible Fire Occurred!</p>
                  <div className="thermal-grid-container">
                      <table className='thermal-table'>
                        <tbody>
                        {[...Array(8)].map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {[...Array(8)].map((_, colIndex) => {
                              const value = thermalData[rowIndex * 8 + colIndex];
                              let color;
                              if (value < 11) {
                              color = '#0000A4';
                            } else if (value < 16) {
                              color = '#0071F7';
                            } else if (value < 21) {
                              color = '#0DECEA';
                            } else if (value < 26) {
                              color = '#0BEDEB';
                            } else if (value < 31) {
                              color = '#6CFD74';
                            } else if (value < 36) {
                              color = '#F4FF4C';
                            } else if (value < 41) {
                              color = '#F39719';
                            } else if (value < 50) {
                              color = '#F76D0E';
                            } else {
                              color = '#F32301';
                            }
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
                </div>
                  <div className='alert-buttons'>
                  <p>Temperature: {temperature}°C</p>
                  <p>Gas: {gasPercentage}</p>
                  <p>Humidity: {humidity}%</p>
                  <p>Flame Detected: {flame}</p>
                  <button onClick={handleSendAlert} className='camera'>
                    Send Alert
                  </button>
                  <button onClick={handleAlertModalClose} className='false-alarm'>
                    False Alarm
                  </button>
                  </div>
              </div>
            </div>
          </>
        )}

  {isSentModalVisible && (
          <>
            <div className='sent-modal'>
              <div className='modal-content'>
                  <h2>Alert Sent!</h2>
                <p>Keep Safe and Prepare BFP Fire Fighters</p>
                  <button onClick={handleSentModalClose} className='alert-cancel-button'>
                    Exit
                  </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  export default Home;