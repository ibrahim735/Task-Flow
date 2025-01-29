interface ButtonProps {
    className?: string;
    onClick?: () => void;
    text: string;
    icon?: React.ReactNode;
    type?: "button" | "submit";
  }

export default function Button({text, className = "", icon, onClick, type = "button"
}: ButtonProps) {
    return (
        <button 
            className={`btn w-full ${className}`}
            onClick={onClick}
            type={type}
        >
            {icon}
            {text}
        </button>
    )
}
