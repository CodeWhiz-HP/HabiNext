export default function Badge({ badges = [] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {badges.includes("7") && (
        <span className="badge badge-info">🎯 7 Days</span>
      )}
      {badges.includes("30") && (
        <span className="badge badge-warning">🥇 30 Days</span>
      )}
      {badges.includes("100") && (
        <span className="badge badge-accent">🏆 100 Days</span>
      )}
    </div>
  );
}
