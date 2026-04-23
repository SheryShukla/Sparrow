import "./Notification.css";

const notifications = [
  {
    type: "like",
    user: "Rahul",
    text: "liked your post",
    time: "2m",
  },
  {
    type: "follow",
    user: "Anjali",
    text: "started following you",
    time: "10m",
  },
  {
    type: "comment",
    user: "Aman",
    text: "commented: Nice post!",
    time: "30m",
  },
  {
    type: "retweet",
    user: "Sanya",
    text: "reposted your tweet",
    time: "1h",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "like":
      return "❤️";
    case "follow":
      return "👤";
    case "comment":
      return "💬";
    case "retweet":
      return "🔁";
    default:
      return "🔔";
  }
};

export default function Notifications() {
  return (
    <div className="notifications">
      <h2>Notifications</h2>

      <div className="notifications__list">
        {notifications.map((n, i) => (
          <div key={i} className="notification">
            <div className="notification__icon">{getIcon(n.type)}</div>

            <div className="notification__content">
              <p>
                <strong>{n.user}</strong> {n.text}
              </p>
              <span>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}