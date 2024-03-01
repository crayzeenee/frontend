import React from 'react'

function LogIn() {
  return (
    <>
        {/* for back button purposes only, will delete this ul after connecting to database */}
        <ul>
        <li><a href="/">Dashboard</a></li>
        </ul>

        <section className='log-in'>
          <img src="/images/logo-nobg.png" alt='Logo' onError={(e) => console.error("Error loading logo:", e)} />
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

              </div>
            </div>
            <div className='buttons'>
              <button className='submit-button' type="submit">LogIn</button>
            </div>
        </section>
    </>
  )
}

export default LogIn