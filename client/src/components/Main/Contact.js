import React from 'react';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import styles from './styles.module.css';

const Contact = () => {
  return (
    <>
      <Header />
     
        <div className={`row ${styles.article}`}>
          <div className="col-md-8 offset-md-2">
            <br /><br />
            <h1>Send us Mail:</h1>

            <form
              action="https://formspree.io/f/mzblnevv"
              method="post"
              id="sendemail"
              className={`${styles.contactForm} needs-validation`}
              noValidate
            >
              <div className="mb-3">
                <label htmlFor="name" className={`${styles.label} form-label`}>
                  Name
                </label>
                <br />
                <input
                  id="name"
                  name="name"
                  className={`form-control ${styles.text} ${styles.input}`}
                  autoComplete="off"
                  required
                />
                {/* Add Bootstrap validation feedback */}
                <div className="invalid-feedback">Please enter your name.</div>
              </div>
              <br />
              <div className="mb-3">
                <label htmlFor="email" className={`${styles.label} form-label`}>
                  Email Address
                </label>
                <br />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${styles.text} ${styles.input}`}
                  autoComplete="off"
                  required
                />
                {/* Add Bootstrap validation feedback */}
                <div className="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <br />
              <div className="mb-3">
                <label htmlFor="message" className={`${styles.label} form-label`}>
                  Your Message
                </label>
                <br />
                <textarea
                  id="message"
                  name="message"
                  rows="8"
                  cols="50"
                  className={`form-control ${styles.text} ${styles.textarea}`}
                  autoComplete="off"
                  required
                ></textarea>
                {/* Add Bootstrap validation feedback */}
                <div className="invalid-feedback">Please enter your message.</div>
              </div>
              <br />
              <input type="submit" value="Send" className={`btn btn-primary ${styles.submitButton}`} />
            </form>
          </div>
          </div>
   
    </>
  );
};

export default Contact;
