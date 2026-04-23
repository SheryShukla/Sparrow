import "./Messages.css";

const chats = [
  {
    name: "Jay",
    message: "Hey, how are you?",
    time: "2m",
  },
  {
    name: "Khushi",
    message: "Let's meet tomorrow",
    time: "10m",
  },
  {
    name: "Aman",
    message: "Project done ✅",
    time: "30m",
  },
];

const messages = [
  { from: "Jay", text: "Hey!", me: false },
  { from: "me", text: "Hi 👋", me: true },
  { from: "Jay", text: "How are you?", me: false },
  { from: "me", text: "I'm good!", me: true },
];

export default function Messages() {
  return (
    <div className="messages">

      {/* LEFT CHAT LIST */}
      <div className="messages__sidebar">
        <h2>Messages</h2>

        {chats.map((chat, i) => (
          <div key={i} className="chat">
            <div className="chat__avatar">👤</div>

            <div className="chat__info">
              <h4>{chat.name}</h4>
              <p>{chat.message}</p>
            </div>

            <span className="chat__time">{chat.time}</span>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="messages__chat">
        <div className="chat__header">Rahul</div>

        <div className="chat__body">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat__message ${m.me ? "me" : ""}`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat__input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>

    </div>
  );
}