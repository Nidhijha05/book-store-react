import React from "react";
import '../pages/Footer.css';
import img2 from '../images/tatvasoft.png';

function Footer() {
    return(
        <>
        <footer className="site-footer" id="footer">
            <div className="bottom-footer">
                <div className="container">
                    <div className="text-center">
                        <div className="footer-logo">
                            <img src={img2} alt="sitelogo" className="img1"></img>
                        </div>
                        <p>2015 Tatvasoft.com. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}

export default Footer;