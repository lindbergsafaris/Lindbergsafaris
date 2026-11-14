

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-32 h-32 md:w-48 md:h-48 animate-pulse">
                    <img
                        src="/logo.png"
                        alt="Lindberg Safaris"
                        className="w-full h-full object-contain"
                    />
                </div>
                {/* Optional: Add a spinner or loading text below if needed */}
                <div className="mt-8 flex justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-0 mx-1"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-150 mx-1"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-300 mx-1"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
