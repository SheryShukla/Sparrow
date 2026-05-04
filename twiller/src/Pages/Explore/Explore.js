import "./Explore.css";

const trends = [
  { category: "Trending in India", title: "#IPL2026", tweets: "45K Tweets" },
  { category: "Technology", title: "#AIRevolution", tweets: "120K Tweets" },
  { category: "Gaming", title: "#Valorant", tweets: "80K Tweets" },
  { category: "News", title: "#Elections", tweets: "60K Tweets" },
];

export default function Explore() {
  return (
    <div className="explore">
      <h2>Explore</h2>

      {/* Search */}
      <div className="explore__search">
        <input type="text" placeholder="Search Sparrow" />
      </div>

      {/* Trends */}
      <div className="explore__trends">
        {trends.map((t, i) => (
          <div key={i} className="trend">
            <span className="trend__category">{t.category}</span>
            <h4>{t.title}</h4>
            <span className="trend__tweets">{t.tweets}</span>
          </div>
        ))}
      </div>
    </div>
  );
}