import React, { useEffect } from "react";
import logo from '../header/CODENOTE-removed-white.png';
import "./Home.css";

const Home = () => {
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const matrix = letters.split("");
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });

      requestAnimationFrame(drawMatrix);
    };

    drawMatrix();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="home">
      <canvas id="matrixCanvas"></canvas>
      <div className="content-container">
        <div className="logo-div">
          <img src={logo} alt="CODENOTE" className="codenote-logo" />
        </div>
        <div className="content">
          <p className="subtitle">Your Ultimate Code Storage & Management Platform</p>
          <a href="/login" className="start-btn">Get Started</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
