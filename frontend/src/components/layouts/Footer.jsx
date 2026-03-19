import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useRef } from "react";

export default function Footer() {
  const githubRef = useRef(null);
  const linkedinRef = useRef(null);
  const canvasRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;

    const ctx = canvas.getContext("2d");

    let width, height;
    let nodes = [];
    let mouse = { x: null, y: null };
    let animationFrameId;

    // ========== SETUP ==========
    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < 50; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
        });
      }
    }

    // ========== ANIMATION LOOP ==========
    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw network connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse interaction - STRONG effect
      if (mouse.x !== null && mouse.y !== null) {
        nodes.forEach((node) => {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 250) {
            // Draw visible line from node to cursor
            const opacity = Math.max(0.3, 1 - dist / 250);
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = "rgba(0, 255, 255, 0.9)";
            ctx.shadowBlur = 12;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            ctx.shadowBlur = 0;

            // STRONG repulsion force
            const force = (1 - dist / 250) * 0.35;
            if (dist > 0) {
              node.x += (dx / dist) * force;
              node.y += (dy / dist) * force;
            }
          }
        });

        // Draw cursor glow effect
        ctx.fillStyle = "rgba(0, 255, 255, 0.15)";
        ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes - more visible
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.95)";
        ctx.fill();

        // Node glow
        ctx.shadowColor = "rgba(0, 255, 255, 0.4)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        node.x += node.vx;
        node.y += node.vy;

        // Boundary bounce with damping
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -0.9;
        }
        if (node.x > width) {
          node.x = width;
          node.vx *= -0.9;
        }
        if (node.y < 0) {
          node.y = 0;
          node.vy *= -0.9;
        }
        if (node.y > height) {
          node.y = height;
          node.vy *= -0.9;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    function handleMouseMove(e) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    function handleTouchMove(e) {
      if (!canvas || !e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }

    function handleTouchEnd() {
      mouse.x = null;
      mouse.y = null;
    }

    function handleResize() {
      resize();
      createNodes();
    }

    // Initialize
    resize();
    createNodes();
    draw();

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <footer ref={footerRef} style={styles.footer}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>

      <div style={styles.top}>
        <h2 style={styles.logo}>SHEDULUX</h2>
        <p style={styles.tagline}>High-performance CPU Scheduling Simulator</p>
      </div>

      <div style={styles.middle}>
        <div>
          <h4 style={styles.heading}>Algorithms</h4>
          <p>FCFS</p>
          <p>SJF</p>
          <p>SRTF</p>
          <p>Round Robin</p>
        </div>

        <div>
          <h4 style={styles.heading}>Features</h4>
          <p>Real-Time Simulation</p>
          <p>Gantt Chart Visualization</p>
          <p>Performance Metrics</p>
          <p>JSON Output Engine</p>
        </div>

        <div>
          <h4 style={styles.heading}>Tech Stack</h4>
          <p>C++ Engine</p>
          <p>React Frontend</p>
          <p>REST API</p>
          <p>Data Visualization</p>
        </div>

        <div style={styles.icon}>
          <p>© {new Date().getFullYear()} SHEDULUX.</p>

          <div style={styles.icon}>
            <a
              ref={githubRef}
              href="https://github.com/sumit-9604"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.3)";
                e.currentTarget.style.color = "#00ffff";
                e.currentTarget.style.filter = "drop-shadow(0 0 12px cyan)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "cyan";
                e.currentTarget.style.filter = "none";
              }}
            >
              <FaGithub size={40} />
            </a>

            <a
              ref={linkedinRef}
              href="https://www.linkedin.com/in/sumit-chaudhary9604/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.3)";
                e.currentTarget.style.color = "#00ffff";
                e.currentTarget.style.filter = "drop-shadow(0 0 12px cyan)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "cyan";
                e.currentTarget.style.filter = "none";
              }}
            >
              <FaLinkedin size={40} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    opacity: 0.35,
  },
  link: {
    color: "cyan",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  icon: {
    display: "inline-flex",
    gap: "15px",
  },
  footer: {
    position: "relative",
    overflow: "hidden",
    background: "rgba(13, 13, 43, 0.85)",
    color: "rgb(0 229 176)",
    padding: "20px 10px",
    fontFamily: "monospace",
  },
  top: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    fontSize: "28px",
    letterSpacing: "4px",
    marginBottom: "10px",
  },
  tagline: {
    opacity: 0.7,
  },
  middle: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "30px",
    position: "relative",
    zIndex: 2,
  },
  heading: {
    marginBottom: "10px",
    color: "cyan",
  },
};
