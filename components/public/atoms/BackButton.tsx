type BackButtonProps = {
    onClick: () => void;
  };
  
  const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="mb-4 text-blue-600 hover:text-blue-800 transition duration-300"
    >
      ← Back
    </button>
  );

  export default BackButton