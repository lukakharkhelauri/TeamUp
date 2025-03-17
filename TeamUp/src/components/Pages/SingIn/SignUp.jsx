import axios from 'axios';
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import '../../../modules/singIn/SignUp.css';
import PriceRangeSlider from '../SingIn/PriceRangeSlider';

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState("defaultRole");
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [experienceYears, setExperienceYears] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("company");
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [projectStyle, setProjectStyle] = useState("");
  const [roleSelected, setRoleSelected] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const clearErrorWithDelay = useCallback(() => {
    setErrorMessage('');
  }, []);

  
    //check email with api (expired free trial)
  // const handleEmailCheck = async () => {
  //   try {
  //     const response = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=663462e543fab55bd97ecaa16c4d81e8f32c53a7`);
  //     if (response.data.data.status === 'invalid') {
  //       setErrorMessage('This email does not exist');
  //       return false;
  //     }
  //     setErrorMessage('');
  //     return true;
  //   } catch (error) {
  //     console.error("Error checking email:", error);
  //     setErrorMessage('Error validating email');
  //     return false;
  //   }
  // };

    //check email without api
  const handleEmailCheck = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        setErrorMessage("Invalid email format");
        return false;
    }

    const commonFakeDomains = ["example.com", "test.com", "fakeemail.com"];
    const emailDomain = email.split("@")[1];

    if (commonFakeDomains.includes(emailDomain)) {
        setErrorMessage("This email domain is not valid");
        return false;
    }

    setErrorMessage(""); 
    return true;
};



  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setErrorMessage('Both password fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isEmailValid = handleEmailCheck(email);
    if (!isEmailValid) return;
  
    const isPasswordValid = validatePasswords();
    if (!isPasswordValid) return;
  
    const user = {
      name,
      email,
      password,
      selectedRole,
      ...(selectedRole === 'developer' ? {
        selectedExperience: selectedExperiences,
        experienceYears,
        selectedStatus,
        priceRange,
      } : {
        selectedStatus,
        selectedFocus,
        projectStyle,
      })
    };
  
    try {
      console.log('Sending POST request to create user');
      const response = await axios.post('http://localhost:5005/users', user);
  
      if (response.data.success) {
        localStorage.clear();  
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('selectedRole', response.data.user.selectedRole);
        localStorage.setItem('isAuthenticated', 'true');

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSelectedRole(null);
        setSelectedStatus("company");
        setPriceRange(0);
        setErrorMessage(''); 
  
        window.location.href = '/';
      } else {
        setErrorMessage('Failed to create user');
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage('Error creating user');
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   const isEmailValid = await handleEmailCheck();
  //   if (!isEmailValid) return;
    
  //   const isPasswordValid = validatePasswords();
  //   if (!isPasswordValid) return;

  //   const user = {
  //     name,
  //     email,
  //     password,
  //     selectedRole,
  //     ...(selectedRole === 'developer' ? {
  //       selectedExperience: selectedExperiences,
  //       experienceYears,
  //       selectedStatus,
  //       priceRange,
  //     } : {
  //       selectedStatus,
  //       selectedFocus,
  //       projectStyle,
  //       priceRange,
  //     })
  //   };

  //   try {
  //     console.log('Sending POST request to create user');
  //     const response = await axios.post('http://localhost:5005/users', user);

  //     if (response.data.success) {
  //       setName('');
  //       setEmail('');
  //       setPassword('');
  //       setConfirmPassword('');
  //       setSelectedRole(null);
  //       setSelectedStatus("company");
  //       setPriceRange(0);
  //       setErrorMessage(''); 

  //       localStorage.setItem('userName', response.data.user.name);
  //       localStorage.setItem('selectedRole', response.data.user.selectedRole);
  //       navigate("/");
  //     } else {
  //       setErrorMessage('Failed to create user');
  //     }
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     setErrorMessage('Error creating user');
  //   }
  // };

  const handleRoleChange = (role) => {
    setSelectedRole(role === selectedRole ? null : role);
    setRoleSelected(true);
    setErrorMessage(''); 
  };

  const handleExperienceChange = (experience) => {
    setSelectedExperiences(prev => {
        if (prev.includes(experience)) {
            setExperienceYears(prevYears => {
                const { [experience]: removed, ...rest } = prevYears;
                return rest;
            });
            return prev.filter(exp => exp !== experience);
        } else {
            return [...prev, experience];
        }
    });
  };

  const handleYearsChange = (experience, years) => {
    if (years === "" || years === "0") {
        setExperienceYears(prev => {
            const { [experience]: removed, ...rest } = prev;
            return rest;
        });
    } else {
        setExperienceYears(prev => ({
            ...prev,
            [experience]: parseInt(years)
        }));
    }
  };

  const handlePriceChange = (priceRangeString) => {
    setPriceRange(priceRangeString);
    console.log('Price range updated:', priceRangeString); 
  };

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
    } else {
      setErrorMessage('');
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (errorMessage) {
      if (name && email && password && confirmPassword) {
        if (errorMessage.includes('enter') || errorMessage.includes('required')) {
          setErrorMessage('');
        }
      }
    }
  }, [name, email, password, confirmPassword]);

  useEffect(() => {
    if (errorMessage) {
      if (selectedRole === 'developer') {
        if (selectedExperiences.length > 0 && Object.keys(experienceYears).length > 0) {
          if (errorMessage.includes('expertise') || errorMessage.includes('experience')) {
            setErrorMessage('');
          }
        }
      } else if (selectedRole === 'client') {
        if (selectedFocus.length > 0 && projectStyle) {
          if (errorMessage.includes('focus') || errorMessage.includes('style')) {
            setErrorMessage('');
          }
        }
      }
    }
  }, [selectedExperiences, experienceYears, selectedFocus, projectStyle, selectedRole]);

  useEffect(() => {
    if (passwordTouched && confirmTouched && password === confirmPassword && errorMessage === "Passwords don't match!") {
      setErrorMessage('');
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="sign-up-container">
      <div className="left-side">
        <h2 className="header">Choose your account type</h2>

        <div className="role-selection">
          <div className={`role-card ${selectedRole === "developer" ? "selected" : ""}`} onClick={() => handleRoleChange("developer")}>
            <h3 className="role-title">&lt;/&gt; Developer</h3>
            <p className="role-description">Create software solutions and join our developer community</p>
          </div>

          <div className={`role-card ${selectedRole === "client" ? "selected" : ""}`} onClick={() => handleRoleChange("client")}>
            <h3 className="role-title">🏢 
            Contractor</h3>
            <p className="role-description">Find developers and get your projects done</p>
          </div>
        </div>

        <AnimatePresence>
          {selectedRole === "developer" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="developer-form"
            >
              <div className="form-section">
                <h3>Register</h3>
                
                {errorMessage && (
                  <div className="error-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {errorMessage}
                  </div>
                )}

                <div className="box-container">
                  <div className="input">
                    <label>Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) {
                          clearErrorWithDelay();
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label>Email <span className="required">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) {
                          clearErrorWithDelay();
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label>Password <span className="required">*</span></label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => {
                        setPasswordTouched(true);
                        if (confirmTouched && password !== confirmPassword) {
                          setErrorMessage("Passwords don't match!");
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label>Confirm Password <span className="required">*</span></label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => {
                        setConfirmTouched(true);
                        if (passwordTouched && password !== confirmPassword) {
                          setErrorMessage("Passwords don't match!");
                        }
                      }}
                      required
                    />
                  </div>

                  <select 
                    className="input-selection" 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="" disabled>Status</option>
                    <option value="company">Company</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="form-section expertise-section">
                <h3>Choose Expertise</h3>
                <div className="checkbox-group">
                  {["Front End Developer", "Back End Developer", "Fullstack Developer", 
                    "UX/UI Designer", "Graphic Designer", "QA Engineer"].map((item) => (
                    <div key={item} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={item}
                        value={item}
                        checked={selectedExperiences.includes(item)}
                        onChange={() => handleExperienceChange(item)}
                      />
                      <label htmlFor={item}>{item}</label>
                      {selectedExperiences.includes(item) && (
                        <input
                          type="number"
                          min="0"
                          value={experienceYears[item] || ""}
                          onChange={(e) => handleYearsChange(item, e.target.value)}
                          placeholder="Years"
                          className="years-input"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section price-range-section">
                <h3>Price Range</h3>
                <PriceRangeSlider onPriceChange={handlePriceChange} />
              </div>

              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
              
              <p className="signin-footer">
                Already have an account? <a href="/SignIn">Sign In</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Client Form */}
        <AnimatePresence>
          {selectedRole === "client" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} 
              className="client-form"
            >
              <h3 id='need-team'>Client Registration</h3>
              <div className="container">
                <h1 className="create-user">Register</h1>

                {errorMessage && (
                  <div className="error-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {errorMessage}
                  </div>
                )}

                <div className='box-container'>
                  <div className="input">
                    <label style={{ display: "block", }}>Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) {
                          clearErrorWithDelay();
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label style={{ display: "block" }}>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) {
                          clearErrorWithDelay();
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label style={{ display: "block" }}>Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => {
                        setPasswordTouched(true);
                        if (confirmTouched && password !== confirmPassword) {
                          setErrorMessage("Passwords don't match!");
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="input">
                    <label style={{ display: "block" }}>Confirm Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => {
                        setConfirmTouched(true);
                        if (passwordTouched && password !== confirmPassword) {
                          setErrorMessage("Passwords don't match!");
                        }
                      }}
                      required
                    />
                  </div>

                  <select className="input-selection" value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="" disabled>status</option>
                    <option value="company">Company</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>
              
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
              <p className="signin-footer">
                Already have an account? <a href="/SignIn" className="signin-link">Sign In</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="right-side">
        <div className="community-box"></div>
        <h3 className="community-header">Join our growing community</h3>
        <p className="community-description">Connect with thousands of developers and clients worldwide. Start your journey today!</p>
      </div>
    </div>
  );
};

export default SignUp;
