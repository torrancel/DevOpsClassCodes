// Reusable infinity symbol with glow
export default function InfinityGlow({ size = 28, className = "" }) {
    return (
        <svg
            width={size}
            height={size * 0.5}
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="infGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#5E8BFF" />
                    <stop offset="50%" stopColor="#8A4DFF" />
                    <stop offset="100%" stopColor="#FF6FD3" />
                </linearGradient>
                <filter id="infGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M 25 25 C 25 10, 45 10, 50 25 C 55 40, 75 40, 75 25 C 75 10, 55 10, 50 25 C 45 40, 25 40, 25 25 Z"
                stroke="url(#infGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                filter="url(#infGlow)"
            />
        </svg>
    );
}
