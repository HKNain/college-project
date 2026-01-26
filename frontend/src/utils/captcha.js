export const generateCaptcha = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

export const drawCaptcha = (canvas, captcha) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  // Add noise lines
  ctx.strokeStyle = "#ddd";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Add noise circles
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.1)`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 15,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // Draw captcha text with random rotation and color
  ctx.font = "bold 32px Arial";
  ctx.textBaseline = "middle";

  for (let i = 0; i < captcha.length; i++) {
    const char = captcha[i];
    const x = 20 + i * 50;
    const y = height / 2;

    // Random rotation
    const rotation = (Math.random() - 0.5) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Random color
    ctx.fillStyle = `rgb(${Math.random() * 100 + 50},${Math.random() * 100 + 50},${Math.random() * 100 + 50})`;
    ctx.fillText(char, 0, 0);

    ctx.restore();
  }

  // Add border
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
};
