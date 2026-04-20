const Loading = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)]'>
            <div className='loader border-8 border-colorTeal border-opacity-30 border-t-colorTeal rounded-full w-16 h-16 animate-spin'></div>
            <p className='mt-4 text-lg text-colorTeal font-semibold'>Loading...</p>
        </div>
    );
};

export default Loading;
