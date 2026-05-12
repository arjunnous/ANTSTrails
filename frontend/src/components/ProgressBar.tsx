export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}