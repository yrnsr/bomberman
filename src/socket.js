const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
  console.log("🟢 WebSocket bağlantısı kuruldu.");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📩 Rakipten mesaj:", data);
};

socket.onclose = () => {
  console.log("🔴 Bağlantı kesildi.");
};

export default socket;
