function Dialog({ title, children, isOpen, onClose, onSubmit }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-6 w-[70%]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <button
                        className="text-3xl cursor-pointer"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                {/* Body */}
                <div className="my-7.5 w-[90%] flex justify-center">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex gap-4 w-full justify-end">
                    <button
                        className="bg-[#ff0008] hover:opacity-80 px-3 py-1 rounded-md text-white font-medium cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-[#00ff5e] hover:opacity-80 px-3 py-1 rounded-md text-white font-medium cursor-pointer"
                        onClick={() => {
                            onSubmit();
                        }}
                    >
                        Success
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dialog;
